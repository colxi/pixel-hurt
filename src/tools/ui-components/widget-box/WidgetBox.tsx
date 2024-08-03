import type { FC } from 'react'
import styled from 'styled-components'


const WidgetBoxContainer = styled.div<{ height: number }>`
  display: grid;
  grid-template-columns: 1fr;
  place-content: start;
  border:1px solid #bf4f74;
  height:${p => p.height}px;
`

const WidgetBoxTitle = styled.div`
  border-bottom:1px solid #bf4f74;
  height: 30px;
`

const WidgetBoxBody = styled.div`
  overflow-y: scroll;
`

interface WidgetBoxProps {
  children: React.ReactNode
  title?: string
  height?: number
}

export const WidgetBox: FC<WidgetBoxProps> = ({ children, title, height = 200 }) => {
  return (
    <>
      <WidgetBoxContainer height={height}>
        {title && <WidgetBoxTitle>{title}</WidgetBoxTitle>}
        <WidgetBoxBody>
          {children}
        </WidgetBoxBody>
      </WidgetBoxContainer>
    </>
  )
}
