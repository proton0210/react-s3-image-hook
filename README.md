# react-s3-image-hook

A powerful and type-safe React hook for fetching and displaying images from AWS S3. Built with AWS SDK v3 and React Query, this package provides an efficient way to handle S3 image operations in your React applications.

## Features

- 🚀 Built with AWS SDK v3
- 💾 Automatic caching with React Query
- 📦 TypeScript support
- 🔄 Proper cleanup of blob URLs
- ⚡ Efficient streaming of image data
- 🛡️ Error handling and loading states
- 🎨 Customizable image component

## Installation

```bash
npm install react-s3-image-hook @aws-sdk/client-s3 @tanstack/react-query
```

or

```bash
yarn add react-s3-image-hook @aws-sdk/client-s3 @tanstack/react-query
```

## Setup

### 1. AWS S3 CORS Configuration

First, configure CORS for your S3 bucket. In your bucket permissions, add the following CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "ExposeHeaders": []
  }
]
```

Replace `https://your-domain.com` with your actual domain.

### 2. Set up React Query

Wrap your application with `QueryClientProvider`:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

## Usage

### Using the S3Image Component

The simplest way to display S3 images:

```tsx
import { S3Image } from "react-s3-image-hook";
import { S3Client } from "@aws-sdk/client-s3";

function MyComponent() {
  const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_S3_READ_ACCESS! as string,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_READ_SECRET! as string,
    },
  });

  return (
    <div className="m-5">
      <S3Image
        s3Client={s3Client}
        bucketName="your-bucket-name"
        imageKey="path/to/image.png"
        width={300}
        height={200}
        alt="My S3 Image"
        className="rounded-lg"
      />
    </div>
  );
}
```

### Using the Hook Directly

For more control over the image display:

```tsx
import { useS3Image } from "react-s3-image-hook";

function CustomImageComponent() {
  const {
    data: imageUrl,
    isLoading,
    error,
  } = useS3Image(s3Client, "your-bucket-name", "path/to/image.png");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading image</div>;
  if (!imageUrl) return null;

  return (
    <img src={imageUrl} alt="Custom S3 Image" className="custom-image-class" />
  );
}
```

## API Reference

### S3Image Component Props

| Prop       | Type     | Required | Description                     |
| ---------- | -------- | -------- | ------------------------------- |
| s3Client   | S3Client | Yes      | AWS S3 client instance          |
| bucketName | string   | Yes      | Name of the S3 bucket           |
| imageKey   | string   | Yes      | Path to the image in the bucket |
| width      | number   | No       | Image width (default: 200)      |
| height     | number   | No       | Image height (default: 200)     |
| alt        | string   | No       | Alt text for the image          |
| className  | string   | No       | CSS classes for the image       |

### useS3Image Hook

```typescript
const { data, isLoading, error } = useS3Image(s3Client, bucketName, imageKey);
```

#### Parameters

- `s3Client`: AWS S3 client instance
- `bucketName`: Name of the S3 bucket
- `imageKey`: Path to the image in the bucket

#### Returns

- `data`: URL of the image (blob URL)
- `isLoading`: Boolean indicating loading state
- `error`: Error object if the fetch failed

## Best Practices

1. **Client Initialization**: Create the S3 client once and reuse it throughout your application.

2. **Environment Variables**: Always use environment variables for AWS credentials:

```env
REACT_APP_AWS_ACCESS_KEY_ID=your_access_key
REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret_key
```

3. **Error Handling**: Always handle loading and error states:

```tsx
{
  isLoading && <LoadingSpinner />;
}
{
  error && <ErrorMessage error={error} />;
}
```

4. **Image Keys**: Use consistent path formatting for image keys:

```typescript
const imageKey = `${prefix}/${filename}.${extension}`;
```

## Common Issues and Solutions

### CORS Errors

If you encounter CORS errors:

1. Verify your bucket's CORS configuration
2. Ensure your domain is listed in AllowedOrigins
3. Check that you're using the correct bucket region

### 403 Forbidden Errors

If you get access denied errors:

1. Verify your AWS credentials
2. Check your IAM user permissions
3. Ensure the bucket policy allows GetObject

## License

MIT © [Vidit Shah]

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.
