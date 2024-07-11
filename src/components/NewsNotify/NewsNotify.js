import React from 'react'
import { NewsNotifyComponent, NewsNotifyComponentP } from './styled'
import { NotificationFilled, NotificationOutlined } from '@ant-design/icons'
import { Box, Container } from '..'

export const NewsNotify = ({ text }) => {
	return (
		<NewsNotifyComponent>
			<Container className='section section-new'>
				<Box className='news-box'>
					<NotificationFilled
						style={{ display: 'flex', alignItems: 'center', padding: '20px' }}
					/>
					<Box className='box-text-news-slide'>
						<NewsNotifyComponentP>
							ประกาศ!! <NotificationOutlined /> &nbsp;
							{text}
						</NewsNotifyComponentP>
					</Box>
				</Box>
			</Container>
		</NewsNotifyComponent>
	)
}
