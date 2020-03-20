import React, { Component } from "react";
import Searchbar from "./components/searchbar/Searchbar";
import axios from "axios";
import "./App.css";
import PageLoader from "./components/loader/Loader";
import ImageGallery from "./components/imageGallery/ImageGallery";
import Button from "./components/button/Button";
import Modal from "./components/modal/Modal";
const KEY = "15315840-46f26c39a26eaa327dca45469";

class App extends Component {
  state = {
    galleryItems: [],
    isLoading: true,
    error: null,
    searchQuery: "",
    page: 1,
    largeImageUrl: "",
    openModal: false
  };

  handleSubmit = e => {
    const { searchQuery, page } = this.state;
    this.setState({ isLoading: true });
    axios
      .get(
        `https://pixabay.com/api/?q=${searchQuery}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12`
      )
      .then(data =>
        this.setState(prevState => ({
          galleryItems: [...prevState.galleryItems, ...data.data.hits]
        }))
      )
      .finally(() => this.setState({ isLoading: false }));
  };

  handleOnSubmit = async e => {
    e.preventDefault();
    await this.setState({ galleryItems: [] });
    await this.handleSubmit();
  };

  handleChange = e => {
    this.setState({ searchQuery: e.target.value });
  };

  componentDidMount = () => {
    this.handleSubmit();
  };

  moreButton = async () => {
    await this.setState(prevState => ({ page: prevState.page + 1 }));
    await this.handleSubmit();
  };

  componentDidUpdate() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  }

  openModal = e => {
    this.setState({ openModal: true, largeImageUrl: e.target.dataset.source });
  };

  toggleModal = () => {
    this.setState({ openModal: false });
  };

  render() {
    const { isLoading, galleryItems, largeImageUrl } = this.state;
    return (
      <div className="App">
        <Searchbar
          handleOnSubmit={this.handleOnSubmit}
          handleChange={this.handleChange}
        />
        {isLoading && <PageLoader />}
        <ImageGallery galleryItems={galleryItems} openModal={this.openModal} />
        <Button moreButton={this.moreButton} />
        {this.state.openModal && (
          <Modal toggleModal={this.toggleModal} modalUrl={largeImageUrl} />
        )}
      </div>
    );
  }
}

export default App;
