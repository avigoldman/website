import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 0 0 10rem 0;

  @media (max-width: 600px) {
    padding: 1rem 1rem 1rem 1rem;
    margin: 0 0 16rem 0;
    background: white;
    opacity: 1;
    box-shadow: rgba(0,0,0,0.19) 0px 4px 20px;
    border-top: 7px solid #2296f3;
    transform: scale(0.9);
    z-index: 1;
  }

  display: flex;

  transition: .2s;
  
  ${props => props.active ? `` : `
    opacity: .5;
  `} 

  pre {
    margin: 1rem auto;
    padding: 1rem;
  }
`

const Index = styled.div`
  font-size: 1.5rem;
  color: #c3c4cd;
  font-family: Menlo, monospace;
`

const Content = styled.div`
  margin-left: 1rem;
  flex: 1;
  width: 0;
`

export default ({ index, children, active, ...props }) => (
  <Wrapper active={active} {...props}>
    <Index>{index})</Index>
    <Content>{children}</Content>
  </Wrapper>
)