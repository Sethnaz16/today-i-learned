import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
//import { Helmet } from 'react-helmet';
import getClient from '../lib/get-contentful-client.js';
import { storeState } from '../lib/store-state.js';

//import { Card, CardHeader } from './card.js';
import { Spinner } from './loading.js';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = props.initialState || {
      error: null,
      isLoaded: false,
      items: []
    };

    // needed for react-snap
    window.snapSaveState = () => {
      storeState(this.state);
    };
  }

  componentDidMount() {
    this.state.isLoaded ||
      getClient(process.env)
        .getEntries({
          content_type: 'post'
        })
        .then(({ items }) => {
          this.setState({
            categories: this.getCategories(items),
            isLoaded: true
          });
        })
        .catch(error => {
          this.setState({
            error,
            isLoaded: true
          });
        });
  }

  getCategories(items) {
    return items.reduce((acc, item) => {
      const category = item.fields.category;
      const categorySlug = category.fields.slug;
      if (!acc[categorySlug]) {
        acc[categorySlug] = { category, posts: [] };
      }

      acc[categorySlug].posts.push(item);
      return acc;
    }, {});
  }

  render() {
    //const { error, categories, isLoaded } = this.state;
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <Spinner />;
    } else {
      return (
        <div>
          {/* <Helmet>
            <title>Today I learned | Home</title>
          </Helmet> */}

          {/* <Card>
          </Card> */}
          <ul className="o-grid">
           {/*  {Object.entries(categories).map(
              
            )} */}
          </ul>
        </div>
      );
    }
  }
}

export default Home;
