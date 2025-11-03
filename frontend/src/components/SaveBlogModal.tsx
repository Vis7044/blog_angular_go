"use client";
import React, { useState } from "react";
import { Modal, Upload, Select, Form } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import { blogService, Status } from "@/services/blogService";
import toast from 'react-hot-toast';

interface SaveBlogModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  title: string;
  content: string;
  saveBlog: (
    title: string,
    content: string,
    status: Status,
    coverPhoto: string,
    tags: string[]
  ) => Promise<void>;
}

const TAG_OPTIONS = [
  { label: "Technology", value: "technology" },
  { label: "Design", value: "design" },
  { label: "Programming", value: "programming" },
  { label: "Business", value: "business" },
  { label: "Lifestyle", value: "lifestyle" },
];

const SaveBlogModal: React.FC<SaveBlogModalProps> = ({
  open,
  onOk,
  title,
  content,
  onCancel,
  saveBlog,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [coverPhoto, setCoverPhoto] = useState("");
  const [photoId, setPhotoId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("You can only upload image files!");
    }
    const isLt5MB = file.size / 1024 / 1024 < 5;
    if (!isLt5MB) {
      toast.error("Image must be smaller than 5MB!");
    }
    return isImage && isLt5MB ? true : Upload.LIST_IGNORE;
  };

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
      const data = await blogService.uploadImage(file);
      const { secureUrl, publicId } = data;

      setCoverPhoto(secureUrl);
      setPhotoId(publicId);
      setFileList([
        {
          uid: publicId,
          name: file.name,
          status: "done",
          url: secureUrl,
        },
      ]);

      toast.success("Image uploaded successfully.");

      onSuccess?.(data);
    } catch (err: any) {
      console.error(err);
      toast.error("Image upload failed.");
      onError?.(err);
    }
  };

  const handleRemove = async () => {
    if (!photoId) return;
    try {
      await blogService.deleteImage(photoId);
      setCoverPhoto("");
      setPhotoId("");
      setFileList([]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleOk = async () => {
    if (!coverPhoto) {
      toast.error("Please upload a cover photo.");
      return;
    }
    if (tags.length === 0) {
      toast.error("Please select at least one tag.");
      return;
    }

    try {
      setLoading(true);
      await saveBlog(title, content, Status.Published, coverPhoto, tags);
      toast.success("Blog saved successfully!");
      onOk();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save the blog.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFileList([]);
    setTags([]);
    setCoverPhoto("");
    setPhotoId("");
  };

  const handleCancel = () => {
    handleRemove();
    resetForm();
    onCancel();
  };

  return (
    <Modal
      title="Save Blog"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Save"
      cancelText="Cancel"
      centered
      zIndex={40}
    >
      <Form layout="vertical">
        <Form.Item label="Cover Photo" required>
          <Upload
            name="coverPhoto"
            customRequest={handleUpload}
            onRemove={handleRemove}
            fileList={fileList}
            beforeUpload={beforeUpload}
            listType="picture-card"
            maxCount={1}
            accept="image/*"
          >
            {fileList.length === 0 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Tags" required>
          <Select
            mode="multiple"
            allowClear
            placeholder="Select tags"
            value={tags}
            onChange={(value) => setTags(value)}
            options={TAG_OPTIONS}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveBlogModal;
