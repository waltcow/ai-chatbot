import { NextResponse } from 'next/server';
import { z } from 'zod';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { auth } from '@/app/(auth)/auth';

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    })
    // Update the file type based on the kind of files you want to accept
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'File type should be JPEG or PNG',
    }),
});

// Initialize R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
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
      // Generate unique filename to avoid conflicts
      const timestamp = Date.now();
      const uniqueFilename = `${timestamp}-${filename}`;

      // Upload to Cloudflare R2
      const uploadCommand = new PutObjectCommand({
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: uniqueFilename,
        Body: new Uint8Array(fileBuffer),
        ContentType: file.type,
        ContentLength: file.size,
      });

      await r2Client.send(uploadCommand);

      // Construct the public URL
      const fileUrl = `${process.env.R2_PUBLIC_URL}/${uniqueFilename}`;

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
      console.error('R2 upload error:', error);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
