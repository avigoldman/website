import React from 'react'
import styled from 'styled-components'

/**
 * We force all the elements to be inline-block so that the puddle animation
 * doesn't spread to the full width of the email client. However, the divs should
 * still act like block elements.
 * To fix this, we inject block-styled divs that disable the puddle animation
 * so that that the content divs look like they are blocks but still fix to their content
 * so that their puddles are sized to their content.
 *
 * There might be a better way to fix this  ¯\_(ツ)_/¯
 */
const ForceBlock = styled.div`
  &&& {
    display: block;

    &:after {
      display: none;
    }
  }
`

export default ({ children }) => (
  <React.Fragment>
  <ForceBlock />
  {children}
  </React.Fragment>
)

