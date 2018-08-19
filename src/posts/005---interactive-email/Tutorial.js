import React from 'react'
import styled, { keyframes } from 'styled-components'
import { StickyContainer, Sticky } from 'react-sticky'


// Post elements
import Scrollama from 'components/Post/Scrollama'
import Graphic from 'components/Post/Graphic'
import CoachMark from 'components/Post/CoachMark'
import Code from 'components/Post/Code'
import Note from 'components/Post/Note'

// Post specific elements
import EmailClient from './components/EmailClient'
import ForceBlock from './components/ForceBlock'
import StyledStep from './components/StyledStep'

const Wrapper = styled.div`
  display: flex;
`

const StepsWrapper = styled.div`
  width: 35%;
  margin-right: 2.5%;

  @media (max-width: 600px) {
    width: 100%;
    margin: 0;
    padding: 450px 0 400px;
  }
`

const StickyWrapper = styled.div`
  flex: 1;
  @media (max-width: 600px) {
    position: absolute;
    width: 100%;
  }
`

const InteractivityWrapper = styled.div`
  display: flex;
  font-size: .875rem;
  color: #777;
`

const Item = styled.button`
  font: inherit;
  padding: .15rem 1rem;
  width: 102px;
  text-align: center;
  border: 1px solid #e4e4e4;
  box-shadow: 0 1px 1px rgba(0,0,0,.06);
  border-radius: 0 5px 5px 0;
  
  &:first-child {
    border-radius: 5px 0 0 5px;
    border-right: 0;
  }

  &[disabled] {
    opacity: .6;
    cursor: not-allowed;
  }

  ${props => props.active && `
    box-shadow: inset 1px 2px 7px rgba(0,0,0,.06);
    color: #666;
  `}
`

const InteractiveToggle = () => (
  <InteractivityWrapper>
    <Item disabled active>Interactive</Item>
    <Item disabled>Fallback</Item>
  </InteractivityWrapper>
)

export default () => (
<Graphic>
  <h3>Building an interactive email</h3>
  <Scrollama settings={{ offset: 1/3 }} sticky>
    {({ Step, index, lastActiveIndex, active }) => (
      <Wrapper>
        <StepsWrapper>
          <Step>{({ active }) => (
            <StyledStep index="1" active={active}>
              <p>We'll start by adding a label which will act as our button.</p>
              
              <Code>{`<label for="button-hook" id="button">Click me!</label>`}</Code>
            </StyledStep>
          )}</Step>
          <Step>{({ active }) => (
            <StyledStep index="2" active={active}>
              <p>Next we'll add a checkbox. This will hold the email's state. If it's checked, we will show the content. If it's unchecked, we won't.</p>

              <Code>{`<input type="checkbox" id="button-hook" />`}</Code>
            </StyledStep>
          )}</Step>
          <Step>{({ active }) => (
            <StyledStep index="3" active={active}>
              <p>Last, let's add the content we want to show when we click the button. We'll put it in a div with the id of <code>#magic-content</code>.</p>
              
              <Code>{`<div id="magic-content">You clicked the button!</div>`}</Code>
            </StyledStep>
          )}</Step>
          <Step>{({ active }) => (
            <StyledStep index="4" active={active}>
              <p>Let's make our label look like a button.</p>
              
              <Code>{`
                #button {
                  background: coral;
                  color: white;
                  padding: 0.67em 1em;
                  display: inline-block;
                  cursor: pointer;
                }
              `}</Code>
            </StyledStep>
          )}</Step>
          <Step>{({ active }) => (
            <StyledStep index="5" active={active}>
              <p>Now we can add the functionality. We'll hide the <code>#magic-content</code> by default.</p>

              <Code>{`
                #magic-content {
                  display: none;
                }
              `}</Code>
              And show it when the checkbox is checked.
              <Code>{`
                #button-hook:checked ~ #magic-content {
                  display: block;
                }
              `}</Code>
              <Note>Give it a try! </Note>
            </StyledStep>
          )}</Step>
          <h3>Adding a fallback</h3>
          <Step>{({ active }) => (
            <StyledStep index="6" active={active}>
              <p>This doesn't <a href="http://blog.gorebel.com/email-client-support">work everywhere</a>. We need to create a fallback for those poor souls that won't get our awesome email. </p>
              <p>Let's wrap our interactive content in a <code>div</code> with the id of <code>#interactive</code>.</p>
              
              <Code>{`<div id="interactive"> ... </div>`}</Code>
              
              <p>And now add a checked checkbox right before <code>#interactive</code>.</p>

              <Code>{`<input type="checkbox" id="interactive-hook" checked />`}</Code>
            </StyledStep>
          )}</Step>
          <Step>{({ active }) => (
            <StyledStep index="7" active={active}>
              <p>We'll hide the interactive content by default.</p>

              <Code>{`
                #interactive {
                  display: none;
                }
              `}</Code>
            </StyledStep>
          )}</Step>
          <Step>{({ active }) => (
            <StyledStep index="8" active={active}>
              <p>Next, we'll force the interactive content to be visible when it is next to a checked checkbox.</p>

              <Code>{`
                #interactive-hook:checked ~ #interactive {
                  display: block;
                }
              `}</Code>
              
              <p>Now if the email client supports the CSS we need, the interactive content will be shown and if it doesn't, our interactive content won't show.</p>
            </StyledStep>
          )}</Step>
          <Step>{({ active }) => (
            <StyledStep index="9" active={active}>
              <p>Lastly, we need some fallback content.</p>
              
              <Code>{`<div id="fallback">Dude, get a better email client.</div>`}</Code>
            </StyledStep>
          )}</Step>
          <Step>{({ active }) => (
            <StyledStep index="10" active={active}>
              <p>To make this work, let's apply the same idea as before but flip the styles. We'll show <code>#fallback</code> by default and hide it if its next to a checked checkbox.</p>
              
              <Code>{`
                #interactive-hook:checked ~ #fallback {
                  display: none;
                }
              `}</Code>
              <Note>Try toggling the interactivity.</Note>
            </StyledStep>
          )}</Step>
          <h3>Clean up</h3>
          <Step>{({ active }) => (
            <StyledStep index="11" active={active}>
              <p>Last step is to hide the checkboxes.</p>

              <Code>{`
                #button-hook, #interactive-hook {
                  display: none !important;
                }
              `}</Code>
            </StyledStep>
          )}</Step>
        </StepsWrapper>
        <StickyWrapper>
          <Sticky topOffset={-80}>
            {({ style, isSticky, wasSticky }) => {
              return (
                <div style={{ ...style, paddingTop: isSticky && 80 }}>
                  <EmailClient titleBar={() => (
                    <CoachMark active={lastActiveIndex === 9}>
                      <InteractiveToggle htmlFor="interactive-hook">Toggle Interactivity</InteractiveToggle>
                    </CoachMark>
                  )}>
                    {lastActiveIndex >= 5 && <input type="checkbox" id="interactive-hook" defaultChecked={true} />}
                    <ForceBlock>
                      <div id={lastActiveIndex >= 5 ? 'interactive' : ''}>
                        {lastActiveIndex >= 0 && (
                          <label htmlFor="button-hook" id="button">Click me!</label>
                        )}
                        {lastActiveIndex >= 1 && (                      
                          <input type="checkbox" id="button-hook" />
                        )}
                        {lastActiveIndex >= 2 && (
                          <ForceBlock>
                            <div id="magic-content">You clicked the button!</div>
                          </ForceBlock>
                        )}
                      </div>
                    </ForceBlock>
                    {lastActiveIndex >= 8 && (
                      <ForceBlock>
                        <div id="fallback">Dude, get a better email client.</div>
                      </ForceBlock>
                    )}
                    <style>{`
                      ${lastActiveIndex >= 3 ? `
                        #button {
                          background: coral;
                          color: white;
                          padding: 0.67em 1em;
                          display: inline-block;
                          cursor: pointer;
                        }` : ''
                      }
                      ${lastActiveIndex >= 4 ? `
                        #magic-content {
                          display: none;
                        }
                        #button-hook:checked ~ #magic-content {
                          display: inline-block;
                        }` : '' 
                      }
                      ${lastActiveIndex >= 6 ? `
                        #interactive {
                          display: none;
                        }` : '' 
                      }
                      ${lastActiveIndex >= 7 ? `
                        #interactive-hook:checked ~ #interactive {
                          display: inline-block;
                        }` : '' 
                      }
                      ${lastActiveIndex >= 9 ? `
                        #interactive-hook:checked ~ #fallback {
                          display: none;
                        }` : ''
                      }
                      ${lastActiveIndex >= 10 ? `
                        #button-hook, #interactive-hook {
                          display: none !important;
                        }` : ''}
                    `}</style>
                  </EmailClient>
                </div>
              )
            }}
          </Sticky>
        </StickyWrapper>
      </Wrapper>
    )}
  </Scrollama>
</Graphic>)