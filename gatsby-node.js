const componentWithMDXScope = require('gatsby-mdx/component-with-mdx-scope')
const path = require('path')
const postTemplate = `${__dirname}/src/templates/post.js`

// Add custom url pathname for blog posts.
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `Mdx`) {
    const slug = `/blog/${path.dirname(node.relativePath).split("---")[1]}/`
    createNodeField({ node, name: `slug`, value: slug })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const results = await graphql(`
    {
      allMdx {
        edges {
          node {
            fileAbsolutePath
            code {
              scope
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  if (results.errors) {
    console.log(JSON.stringify(results.errors, null, 2))
  }

  // Create blog posts pages.
  results.data.allMdx.edges.forEach(({
    node: {
      fileAbsolutePath,
      fields: { slug },
      code: { scope }
    }
  }) => {
    console.log(scope)
    createPage({
      path: slug,
      component: componentWithMDXScope(postTemplate, scope || [], __dirname),
      context: { slug }
    })
  })
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [`${__dirname}/src`, 'node_modules']
    }
  })
}