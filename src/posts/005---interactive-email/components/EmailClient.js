import React from 'react'
import styled from 'styled-components'


const Wrapper = styled.div`
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 4px 20px;
  border-radius: 5px;
  height: 400px;
  max-width: 800px;
  width: 100%;
  margin: auto;
  transition: .5s;
`

const TitleBar = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TitleBarButtons = styled.div`
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #FC605A;

  &:after, &:before {
    content: "";
    border-radius: 50%;
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
  }

  &:before {
    left: 20px;
    background: #FDBC40;
  }

  &:after {
    left: 40px;
    background: #33C748;
  }
`

const Content = styled.div`
  padding: 1rem 1.5rem;
`

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 .5rem;
  font-size: 13px;
  border-bottom: 1px solid #eee;
`

const Label = styled.label`
  color: #777;
`

const Input = styled.input`
  border: 0;
  background: white;
  height: 30px;
  width: 100%;
  font: inherit;
  border-radius: 3px;
  padding: 0 0.5rem;
  color: inherit;
`

const Body = styled.div`
  padding: 1rem 0 0 0;

  *:not(input) {
    transition: .5s;
  }

  *:not(style) {
    display: inline-block;
  }

  * {
    &:after {
      content: "";
      display: block;
      border-radius: 50%;
      visibility: hidden;
      border: 3px solid #37aadc;
      box-shadow: 0px 0px 18px rgba(55, 170, 220, 0.8), 0px 0px 3px rgb(231, 235, 236);
      transform: translate(-50%, -50%);
      position: absolute;
      top: 50%;
      left: 50%;
    }

    &:after {
      animation: look-at-me .75s ease-out 0s;
    }
  }

  @keyframes look-at-me {
    0% {
      min-width: 5px;
      width: 100%;
      padding-top: 100%;
      visibility: visible;
      opacity: 0;
    }
  
    10% {
      opacity: 1;
    }
  
    100% {
      min-width: 30px;
      width: 130%;
      padding-top: 130%;
      opacity: 0;
    }
}

`

export default ({
  children,
  toEmail = 'me@avigoldman.com',
  fromEmail = 'marketing@sparkpost.com',
  subject = 'Our Email Rox',
  ...props
}) => (
  <Wrapper {...props}>
    <TitleBar>
      <TitleBarButtons />
      <div>{props.titleBar && props.titleBar()}</div>
    </TitleBar>
    <Content>
      <InputWrapper>
        <Label>To:</Label><Input value={toEmail} disabled/>
      </InputWrapper>
      <InputWrapper>
        <Label>From:</Label><Input value={fromEmail} disabled/>
      </InputWrapper>
      <InputWrapper>
        <Label>Subject:</Label><Input value={subject} disabled/>
      </InputWrapper>
      <Body>{children}</Body>
    </Content>
  </Wrapper>
)