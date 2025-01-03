"use client";
import React, { useState, useEffect } from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { useS3Image } from "../hooks/useS3Image";

export interface S3ImageProps {
  s3Client: S3Client;
  bucketName: string;
  imageKey: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

export const S3Image: React.FC<S3ImageProps> = ({
  s3Client,
  bucketName,
  imageKey,
  width = 200,
  height = 200,
  alt = "",
  className = "",
}) => {
  const {
    data: imageUrl,
    isLoading,
    error,
  } = useS3Image(s3Client, bucketName, imageKey);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageUrl) {
      setLocalImageUrl(imageUrl);
    }
    return () => {
      if (localImageUrl) {
        URL.revokeObjectURL(localImageUrl);
      }
    };
  }, [imageUrl]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading image</div>;
  if (!localImageUrl) return null;

  return (
    <img
      src={localImageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};
