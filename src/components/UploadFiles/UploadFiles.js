import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Modal, Upload } from 'antd'
import { getBase64 } from '../../helpers/functions'
import { Box } from '../Box'

export const UploadFiles = (props) => {
	const [previewVisible, setPreviewVisible] = useState(false)
	const [previewImage, setPreviewImage] = useState('')
	const [previewTitle, setPreviewTitle] = useState('')
	const [fileList, setFileList] = useState([])

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj)
		}
		setPreviewImage(file.url || file.preview)
		setPreviewVisible(true)
		setPreviewTitle(
			file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
		)
	}
	const handleCancel = () => setPreviewVisible(false)
	const handleChange = ({ fileList: newFileList }) => {
		props.onTrigger(newFileList)
		setFileList([...newFileList])
	}

	const uploadButton = (
		<div>
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	)

	return (
		<Box>
			<Upload
				beforeUpload={() => false}
				listType='picture-card'
				fileList={fileList}
				onPreview={handlePreview}
				onChange={handleChange}
				maxCount={props.maxCount}
			>
				{fileList.length >= props.maxCount ? null : uploadButton}
			</Upload>
			<Modal
				visible={previewVisible}
				title={previewTitle}
				footer={null}
				onCancel={handleCancel}
			>
				<img alt='example' style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</Box>
	)
}
