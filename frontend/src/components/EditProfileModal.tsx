'use client'

import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
  user: any
  onSave: (values: any) => void
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  user,
  onSave,
}) => {
  const [form] = Form.useForm()

  // Prefill user data when modal opens
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        username: user.username,
        bio: user.bio,
        address: user.address || '123, Palm Residency, Sector 62, Noida, Uttar Pradesh, India – 201309',
      })
    }
  }, [user, form])

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values)
        onClose()
      })
      .catch(() => {})
  }

  return (
    <Modal
      title="Edit Profile Details"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="Save"
      centered
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please enter a username' }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item label="Bio" name="bio">
          <Input.TextArea placeholder="Write something about yourself..." rows={3} />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input.TextArea placeholder="Enter your address" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
