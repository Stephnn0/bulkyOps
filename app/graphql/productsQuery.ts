export const productsQuery =
`{
    products {
      edges {
        node {
      handle
      id
      descriptionHtml
      tags
      title
      status
      vendor
      updatedAt
      templateSuffix
      publishedAt
        }
      }
    }
  }`