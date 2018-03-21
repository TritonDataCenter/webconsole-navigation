'use strict';


module.exports = [
  {
    path: '/datacenters',
    method: 'graphql',
    handler: {
      graphql: {
        method: async (...[consul,, request]) => {
          let datacenters = [];
          try {
            const result = await consul.kv.get('datacenters');
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
          let categories = [];
          try {
            const result = await consul.kv.get('categories');
            categories = JSON.parse(result.Value);
          } catch (err) {
            request.log(['error', 'consul', 'categories'], err);
            return err;
          }

          return categories.map((category) => {
            return {
              name: category.name,
              slug: category.slug || category.name.toLowerCase(),
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
  },
  {
    path: '/service',
    method: 'graphql',
    handler: {
      graphql: {
        method: async (...[consul,, request]) => {
          const { slug } = request.payload;

          let categories = [];
          try {
            const result = await consul.kv.get('categories');
            categories = JSON.parse(result.Value);
          } catch (err) {
            request.log(['error', 'consul', 'categories'], err);
            return err;
          }

          return categories
            .reduce((sum, { products }) => sum.concat(products), [])
            .find((product) => product.slug === slug);
        }
      }
    }
  }
];
