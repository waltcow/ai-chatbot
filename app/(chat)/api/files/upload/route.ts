import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: '文件大小必须小于 5MB',
    })
    // Update the file type based on the kind of files you want to accept
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: '仅支持 JPEG 或 PNG 文件类型',
    }),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  if (request.body === null) {
    return new Response('请求正文为空', { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: '未上传文件' }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(', ');

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get filename from formData since Blob doesn't have name property
    const filename = (formData.get('file') as File).name;
    const fileBuffer = await file.arrayBuffer();

    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      // Generate unique filename to avoid conflicts
      const timestamp = Date.now();
      const uniqueFilename = `${timestamp}-${filename}`;
      const filePath = join(uploadsDir, uniqueFilename);

      // Save file to local filesystem
      await writeFile(filePath, Buffer.from(fileBuffer));

      // Return the URL that can be used to access the file
      const fileUrl = `/uploads/${uniqueFilename}`;

      const data = {
        url: fileUrl,
        downloadUrl: fileUrl,
        pathname: filename, // 返回原始文件名用于显示
        contentType: file.type, // 添加 contentType 用于前端判断文件类型
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };

      return NextResponse.json(data);
    } catch (error) {
      console.error('Local upload error:', error);
      return NextResponse.json({ error: '上传失败' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: '请求处理失败' },
      { status: 500 },
    );
  }
}
