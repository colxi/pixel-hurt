import type { FC } from 'react'
import styled from 'styled-components'


const WidgetBoxContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  place-content: start;
  border:1px solid #bf4f74;
`

const WidgetBoxTitle = styled.div`
  border-bottom:1px solid #bf4f74;
  height: 30px;
`

const WidgetBoxBody = styled.div<{ height: WidgetBoxProps['height'] }>`
  overflow-y: scroll;
  height:${p => p.height === 'auto' ? 'auto' : `${p.height}px`};
`

interface WidgetBoxProps {
  children: React.ReactNode
  title?: string
  height?: number | 'auto'
}

export const WidgetBox: FC<WidgetBoxProps> = ({ children, title, height = 'auto' }) => {
  return (
    <>
      <WidgetBoxContainer>
        {title && <WidgetBoxTitle>{title}</WidgetBoxTitle>}
        <WidgetBoxBody height={height}>
          {children}
        </WidgetBoxBody>
      </WidgetBoxContainer>
    </>
  )
}
