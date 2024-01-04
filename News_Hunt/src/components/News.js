import React, { useEffect, useState } from 'react';
import NewsItems from './NewsItems';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  let ApiKey = process.env.REACT_APP_APIKEY;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const TofirstUppercase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${ApiKey}&page=${page}&pagesize=${props.pageSize}`;

    try {
      setLoading(true);
      let data = await fetch(url);
      let parsedData = await data.json();
      console.log(parsedData);
      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);
      props.setProgress(100);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    updateNews();
    // eslint-disable-next-line
  }, [props.category, props.country, props.pageSize]);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${ApiKey}&page=${nextPage}&pagesize=${props.pageSize}`;

    try {
      setLoading(true);
      let data = await fetch(url);
      setPage(nextPage);
      let parsedData = await data.json();
      console.log(parsedData);
      setArticles(articles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching more data:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className='m-5 text-center text-light'>News_Hunt - Top {TofirstUppercase(props.category)} Headlines</h2>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className='container'>
          <div className='row'>
            {articles.map((element) => (
              <div className='col-md-4' key={element.url}>
                <NewsItems
                  title={element.title ? element.title.slice(0, 35) : ''}
                  description={element.description ? element.description.slice(0, 40) : ''}
                  ImgUrl={element.urlToImage}
                  NewsUrl={element.url}
                  date={element.publishedAt}
                  Auther={element.author}
                  Source={element.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: 'in',
  pageSize: 12,
  category: 'general',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
