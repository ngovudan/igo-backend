import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from 'src/core/schemas/category.schema';
import { CategoryType } from 'src/core/types';
import { Model } from 'mongoose';
import { BaseListResponse } from 'src/common/dtos';
import { ListCategoryDto } from './dtos';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async list(options: ListCategoryDto): Promise<BaseListResponse<Category>> {
    const [docs, total] = await Promise.all([
      this.categoryModel.find().populate('parent').lean(),
      this.categoryModel.countDocuments(options),
    ]);
    return {
      docs,
      $metadata: {
        total,
      },
    };
  }

  async getRootTree(): Promise<Category[]> {
    const data: Category[] = await this.categoryModel.find({ path: '' }).lean();
    const result: any[] = await Promise.all(
      data.map((category) => {
        const regex = new RegExp(`,${category.name},`);
        return this.categoryModel.find({ path: regex }).lean();
      }),
    );
    return data.concat(result).flat();
  }

  handleTreeLoop(categories: CategoryType[], parentId: string): CategoryType[] {
    const children = categories.filter((category) => {
      if (category?.parent)
        return category.parent.toString() === parentId.toString();
    });
    children.forEach((category) => {
      category['children'] = this.handleTreeLoop(categories, category._id);
    });
    return children;
  }

  async getChildrenRootTree(path = 'Default'): Promise<any> {
    const categories: any = await this.categoryModel
      .find({
        $and: [
          {
            ancestorsName: path,
          },
          {
            enabled: { $eq: true },
          },
          {
            ancestorsLength: { $lte: 4 },
          },
        ],
      })
      .lean();
    const topLevel = categories.filter(
      (category) => category.ancestorsLength === 1,
    );
    const result = topLevel.map((category) => {
      if (category) {
        category['children'] = this.handleTreeLoop(categories, category._id);
      }
      return category;
    });
    return result;
  }

  async get(id: string): Promise<Category> {
    return this.categoryModel.findById(id).populate('parent').lean();
  }

  async create(body: Category): Promise<Category> {
    const newBody = await this.handleDependents({ ...body });
    const category = new this.categoryModel(newBody);
    await category.save();
    return category;
  }

  async update(id: string, body: Category): Promise<Category> {
    const category = await this.categoryModel.findById(id);
    const prevCategory = { ...category.toObject() };

    category.set({ ...body });

    await Promise.all([
      category.save(),
      this.updateChildrenAncestorName(prevCategory, category),
    ]);
    return category;
  }

  async remove(id: string): Promise<{
    deletedCount: number;
  }> {
    const category = await this.categoryModel.findById(id).lean();
    const deleteCategories = await this.categoryModel.deleteMany({
      $or: [{ path: { $regex: `,${category.name},` } }, { _id: id }],
    });
    return deleteCategories;
  }

  async getChildrenByPath(path: string): Promise<Category[]> {
    return this.categoryModel
      .find({
        path: { $regex: path },
      })
      .lean();
  }

  async handleDependents(category: Category | any) {
    let parent = null;
    if (category.parent)
      parent = await this.categoryModel.findOne({ _id: category.parent });

    if (parent) {
      // update hasChildren
      if (!parent.hasChildren) {
        parent.set({
          // hasChildren: await this.isHasChildren(parent._id)
          hasChildren: !parent.hasChildren,
        });
        parent.save();
      }
      // update path, ancestors, ancestorsName
      const { ancestors, ancestorsName } = this.getAncestorsForChildren(parent);
      category = {
        ...category,
        path: parent.path
          ? `${parent.path}${parent.name},`
          : `,${parent.name},`,
        ancestors,
        ancestorsName,
        ancestorsLength: ancestors.length,
      };
    }
    return category;
  }

  async isHasChildren(parentId: string): Promise<boolean> {
    const count = await this.categoryModel.countDocuments({
      parent: parentId,
    });
    if (!count) return false;
    return true;
  }

  getAncestorsForChildren(parent: Category & { _id: string }) {
    const ancestors = [];
    const ancestorsName = [];

    if (parent?.ancestors?.length) ancestors.push(...parent.ancestors);
    if (parent?.ancestorsName?.length)
      ancestorsName.push(...parent.ancestorsName);

    ancestors.push(parent._id);
    ancestorsName.push(parent.name);
    return { ancestors, ancestorsName };
  }

  async updateChildrenAncestorName(
    prevCategory: Category | any,
    currentCategory: Category,
  ): Promise<void> {
    if (prevCategory?.name === currentCategory?.name) return;

    const promises = [];
    const children: any = await this.getChildrenByPath(
      `,${prevCategory.name},`,
    );

    children.forEach((c) => {
      // update ancestorsName
      const index = c.ancestorsName.findIndex((l) => l === prevCategory.name);
      if (index !== -1) c.ancestorsName[index] = currentCategory.name;
      // update path
      if (c.path)
        c.path = c.path.replace(prevCategory.name, currentCategory.name);
      promises.push(this.categoryModel.updateOne({ _id: c._id }, c));
    });
    await Promise.all(promises);
  }

  async getCategories(): Promise<any> {
    const categories: any = await this.categoryModel
      .find({
        $and: [
          {
            enabled: { $eq: true },
          },
          {
            ancestorsLength: { $lte: 4 },
          },
        ],
      })
      .lean();
    const topLevel = categories.filter(
      (category: any) => category.ancestorsLength === 0,
    );
    const result = topLevel.map((category) => {
      if (category) {
        category['children'] = this.handleTreeLoop(categories, category._id);
      }
      return category;
    });
    return result;
  }
}
