"use client";
import React, { useEffect, useState } from "react";
import { Modal, Upload, Select, Form } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { UploadOutlined } from "@ant-design/icons";
import { blogService, Status } from "@/services/blogService";
import toast from "react-hot-toast";

interface SaveBlogModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  title: string;
  content: string;
  Edittags: string[];
  EditcoverPhoto: string;
  saveBlog: (
    title: string,
    content: string,
    status: Status,
    coverPhoto: string,
    tags: string[]
  ) => Promise<void>;
}

const SaveBlogModal: React.FC<SaveBlogModalProps> = ({
  open,
  onOk,
  title,
  content,
  onCancel,
  saveBlog,
  Edittags,
  EditcoverPhoto,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [coverPhoto, setCoverPhoto] = useState(EditcoverPhoto || "");
  const [photoId, setPhotoId] = useState("");
  const [tags, setTags] = useState<string[]>(Edittags || []);
  const [loading, setLoading] = useState(false);
  const [tagOptions, setTagOptions] = useState<{ label: string; value: string }[]>(
  []
);

const handleSearchTags = async (searchText: string) => {
  if (!searchText) return;

  try {
    const data = await blogService.searchTags(searchText);  

    const formatted = data.map((tag) => ({
      label: tag.label,
      value: tag.value,
    }));
    setTagOptions(formatted);
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    if (open) {
      setTags(Edittags || []);
      setCoverPhoto(EditcoverPhoto || "");

      if (EditcoverPhoto) {
        setFileList([
          {
            uid: "-1",
            name: "cover.jpg",
            status: "done",
            url: EditcoverPhoto,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [open, EditcoverPhoto, Edittags]);

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
    if (photoId) {
      try {
        await blogService.deleteImage(photoId);
      } catch (err) {
        console.error(err);
      }
    }
    setCoverPhoto("");
    setPhotoId("");
    setFileList([]);
    return true;
  };

  const handleOk = async () => {
    if (!coverPhoto) {
      toast.error("Please upload a cover photo before saving.");
      return;
    }

    try {
      setLoading(true);
      await saveBlog(title, content, Status.Published, coverPhoto, tags);
      toast.success("Blog saved successfully!");
      onOk();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save the blog.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
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
            mode="tags"
            allowClear
            showSearch
            placeholder="Search tags"
            value={tags}
            onSearch={handleSearchTags}
            options={tagOptions}
            onChange={(value) => setTags(value)}
            filterOption={false} 
          />

        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaveBlogModal;
