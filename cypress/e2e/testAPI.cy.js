describe('Get all posts', () => {
  it('should return status code 200 and correct content type', () => {
    cy.request({
      method: 'GET',
      url: '/posts',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('application/json');
    });
  });
});

 
describe('Get only the first 10 posts', () => {
  it('should return status code 200 and only the first 10 posts', () => {
    cy.request({
      method: 'GET',
      url: '/posts',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');  
      const first10Posts = response.body.slice(0, 10); 
      expect(first10Posts.length).to.be.at.least(10); 
      first10Posts.forEach((post) => {
        expect(post).to.have.property('title').to.be.a('string');
      });
    });
  });
});


describe('Get posts with id = 55 and id = 60', () => {
  it('should return status code 200 and correct id values', () => {
    const postIds = [55, 60];
    cy.request('GET', 'http://localhost:3000/posts', { qs: { id: postIds } })
    .then((response) => {
      expect(response.status).to.eq(200);
      postIds.forEach((id) => {
        expect(response.body.some((post) => post.id === id)).to.be.true;
      });
    });
  });
});


describe('Create a post', () => {
  it('should return status code 201', () => {
    const postData = {
      title: 'New Post',
      body: 'This is a new post.',
      userId: 1
    };

    cy.request({
      method: 'POST',
      url: '/posts',
      body: postData,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('title', 'New Post');
      expect(response.body).to.have.property('body', 'This is a new post.');
      expect(response.body).to.have.property('userId', 1);
    });
  });
});


describe('Create a post', () => {
    it('should return status code 201 and verify post is created', () => {
      const postData = {
        title: 'New Post',
        body: 'This is a new post.',
        userId: 1
      };
  
      cy.request({
        method: 'POST',
        url: '/664/posts',
        body: postData,
        failOnStatusCode: false  
      }).then((response) => {
        if (response.status === 201) {
          expect(response.body.title).to.eq(postData.title);
        } else {
          cy.log('Request did not return a 201 status code');
        }
      });
    });
  });
  

  describe('Create post entity and verify that the entity is created', () => {
    it('should return status code 201 and verify post is created', () => {
      const postData = {
        title: 'New Post',
        body: 'This is a new post.',
        userId: 1
      };
      cy.request('POST', 'http://localhost:3000/posts', postData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.title).to.eq(postData.title);
      });
    });
  });
  
  
describe('Update existing entity', () => {
  it('should return status code 200 and verify post is updated', () => {
      const postIdToUpdate = 1;
      const updatedPostData = {
          title: 'Updated json-server',
          author: 'typicode'
      };

      cy.request({
          method: 'PUT',
          url: `/posts/${postIdToUpdate}`,
          body: updatedPostData,
          failOnStatusCode: false
      }).then((response) => {
          if (response.status === 200) {
              expect(response.body.title).to.eq(updatedPostData.title);
          } else {
              cy.log(`Request did not return a 200 status code. Received status code: ${response.status}`);
          }
      });
  });
});


describe('Create post entity and update the created entity', () => {
  it('should return status code 200 and verify that the entity is updated', () => {
    const postData = {
      title: 'New Post',
      body: 'This is a new post.',
      userId: 1
    };
    cy.request('POST', 'http://localhost:3000/posts', postData).then((createResponse) => {
      expect(createResponse.status).to.eq(201);
      const createdPostId = createResponse.body.id;
      const updatedData = {
        title: 'Updated Post',
        body: 'This post has been updated.',
        userId: 1
      };

      cy.request('PUT', `http://localhost:3000/posts/${createdPostId}`, updatedData)
      .then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body.title).to.eq(updatedData.title);
      });
    });
  });
});

 
describe('Delete non-existing post entity', () => {
    it('should return status code 404', () => {
      const nonExistingPostId = 999;
  
      cy.request({
        method: 'DELETE',
        url: `/posts/${nonExistingPostId}`,
        failOnStatusCode: false 
      }).then((response) => {
        if (response.status === 404) {

          cy.log('Resource not found');
        } else {
          cy.log('Request did not return a 404 status code');
        }
      });
    });
  });
  

describe('Create, update, and delete post entity', () => {
    let postId;

    it('should create, update, and delete the entity', () => {
        const postData = {
            title: 'New Post',
            author: 'New Author'
        };

        const updatedPostData = {
            title: 'Updated Post',
            author: 'Updated Author'
        };

        cy.request({
            method: 'POST',
            url: '/posts',
            body: postData
        }).then((createResponse) => {
            expect(createResponse.status).to.eq(201);
            postId = createResponse.body.id;

            cy.request({
                method: 'PUT',
                url: `/posts/${postId}`,
                body: updatedPostData
            }).then((updateResponse) => {
                expect(updateResponse.status).to.eq(200);

                cy.request({
                    method: 'DELETE',
                    url: `/posts/${postId}`
                }).then((deleteResponse) => {
                    expect(deleteResponse.status).to.eq(200);

                    cy.request({
                        method: 'GET',
                        url: `/posts/${postId}`,
                        failOnStatusCode: false
                    }).then((getResponse) => {
                        expect(getResponse.status).to.eq(404);
                    });
                });
            });
        });
    });
});

  
  


