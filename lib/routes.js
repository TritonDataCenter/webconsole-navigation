'use strict';


module.exports = [
  {
    path: '/datacenters',
    method: 'graphql',
    handler: {
      graphql: {
        method: async (...[consul,, request]) => {
          let datacenters;
          try {
            const result = await consul.kv.get({ key: 'datacenters '});
            datacenters = JSON.parse(result.Value);
          } catch (err) {
            request.log(['error', 'consul', 'datacenters'], err);
            return err;
          }

          return datacenters;
        }
      }
    }
  },
  {
    path: '/categories',
    method: 'graphql',
    handler: {
      graphql: {
        method: async (...[consul,, request]) => {
          let categories;
          try {
            const result = await consul.kv.get({ key: 'nav '});
            categories = JSON.parse(result.Value);
          } catch (err) {
            request.log(['error', 'consul', 'categories'], err);
            return err;
          }

          return categories.map((category) => {
            return {
              name: category.name,
              slug: category.slug,
              products: category.products.map((product) => {
                return {
                  name: product.name,
                  description: product.description,
                  url: product.url || (request.baseUrl + product.path)
                };
              })
            };
          });
        }
      }
    }
  }
];
