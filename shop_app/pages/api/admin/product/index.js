import { NextResponse } from "next/server";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";
import slugify from "slugify";
// Примечание: проверку авторизации и админа (auth/admin) в App Router 
// обычно выносят в middleware Next.js или выполняют прямо внутри функции.

export async function POST(req) {
  try {
    await db.connectDb();
    const body = await req.json();

    if (body.parent) {
      // Ищем родительский товар и добавляем в него новый subProduct
      const parent = await Product.findById(body.parent);
      if (!parent) {
        await db.disconnectDb();
        return NextResponse.json(
          { message: "Parent product not found !" },
          { status: 400 }
        );
      }

      await Product.findByIdAndUpdate(
        body.parent,
        {
          $push: {
            subProducts: {
              sku: body.sku,
              color: body.color,
              images: body.images,
              sizes: body.sizes,
              discount: body.discount,
            },
          },
        },
        { new: true }
      );

      await db.disconnectDb();
      return NextResponse.json(
        { message: "Sub-product added successfully." },
        { status: 200 }
      );
    } else {
      // Создаем новый основной товар
      const slug = slugify(body.name);
      const newProduct = new Product({
        name: body.name,
        description: body.description,
        brand: body.brand,
        details: body.details,
        questions: body.questions,
        slug,
        category: body.category,
        subCategories: body.subCategories,
        subProducts: [
          {
            sku: body.sku,
            color: body.color,
            images: body.images,
            sizes: body.sizes,
            discount: body.discount,
          },
        ],
      });

      await newProduct.save();
      await db.disconnectDb();
      return NextResponse.json(
        { message: "Product created Successfully." },
        { status: 200 }
      );
    }
  } catch (error) {
    await db.disconnectDb();
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}