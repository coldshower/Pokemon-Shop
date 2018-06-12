import React, { Component } from "react";
import { connect } from "react-redux";
import PokemonCard from "./PokemonCard";
import Sidebar from "./Sidebar";
// import { Pagination } from "react-bootstrap";
import { push } from "react-router-redux";
import Paginating from "./Paginating";
import { Link } from "react-router-dom";

class PokemonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // pokemon: []
      typeFilter: null,
      levelFilter: null,
      priceFilter: null,
      nameFilter: null,
      typeHidden: true,
      priceHidden: true
    };
    this.handleTypeFilter = this.handleTypeFilter.bind(this);
    this.handlePriceFilter = this.handlePriceFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.toggleTypeHidden = this.toggleTypeHidden.bind(this);
    this.togglePriceHidden = this.togglePriceHidden.bind(this);
    this.changePage = this.changePage.bind(this);
    this.minusOnePage = this.minusOnePage.bind(this);
    this.plusOnePage = this.plusOnePage.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    return { nameFilter: props.searchedName };
  }

  // State Setters

  handleTypeFilter(type) {
    this.resetFilters();
    this.setState({
      typeFilter: type
    });
  }
  handlePriceFilter(priceRange) {
    this.resetFilters();
    this.setState({
      priceFilter: priceRange
    });
  }

  resetFilters() {
    this.setState({
      typeFilter: null,
      levelFilter: null,
      priceFilter: null,
      nameFilter: null
    });
    this.props.history.push("/pokemon/?page=" + 1);
  }

  toggleTypeHidden() {
    this.setState({
      typeHidden: !this.state.typeHidden
    });
  }
  togglePriceHidden() {
    this.setState({
      priceHidden: !this.state.priceHidden
    });
  }

  // Filter methods

  filterType() {
    return this.props.pokemon.filter(
      poke => poke.type.indexOf(this.state.typeFilter) > -1
    );
  }
  filterLevel() {
    return this.props.pokemon.filter(
      poke => poke.type.indexOf(this.state.typeFilter) > -1
    );
  }
  filterPrice() {
    let arr = this.state.priceFilter.split(/[\s-]+/);
    return this.props.pokemon.filter(
      poke => poke.price >= Number(arr[0]) && poke.price <= Number(arr[1])
    );
  }
  filterName() {
    return this.props.pokemon.filter(
      poke =>
        poke.name
          .toLowerCase()
          .indexOf(this.props.searchedName.toLowerCase()) !== -1
    );
  }
  changePage(page) {
    this.props.history.push("/pokemon/?page=" + page);
  }

  currentPokemon() {
    let pokemon = this.props.pokemon;
    if (this.state.typeFilter) {
      pokemon = this.filterType();
    }
    if (this.state.levelFilter) {
      pokemon = this.filterLevel();
    }
    if (this.state.priceFilter) {
      pokemon = this.filterPrice();
    }
    if (this.state.nameFilter) {
      pokemon = this.filterName();
    }
    return pokemon;
  }
  minusOnePage(page) {
    page = Number(page) - 1;
    return page;
  }

  plusOnePage(page) {
    if (!page) {
      page = 1;
    }
    page = Number(page) + 1;
    return page;
  }

  render() {
    const pokemon = this.currentPokemon();
    const perPage = 15;
    const pages = Math.ceil(pokemon.length / perPage);
    // let startOffset =
    //   pokemon.length < this.props.pokemon.length
    //     ? 1
    //     : (this.props.page - 1) * perPage;
    let startOffset;
    let offSetCounter = 0;
    if (pokemon.length < this.props.pokemon && offSetCounter <= 0) {
      offSetCounter++;
      startOffset = 1;
    } else {
      startOffset = (this.props.page - 1) * perPage;
    }
    // pokemon.length < this.props.pokemon.length
    //   ? 1
    //   : (this.props.page - 1) * perPage;
    let startCount = 0;

    return (
      <div className="container mb-5">
        <div className="row">
          <Sidebar
            handleTypeFilter={this.handleTypeFilter}
            handlePriceFilter={this.handlePriceFilter}
            resetFilters={this.resetFilters}
            toggleTypeHidden={this.toggleTypeHidden}
            typeHidden={this.state.typeHidden}
            togglePriceHidden={this.togglePriceHidden}
            priceHidden={this.state.priceHidden}
            page={this.props.page}
          />

          {pokemon.length === 0 ? (
            <div className="col-9 col-sm-7 col-md-9 mx-auto">
              <p>
                This page is either loading or there are no Pokemon found...
              </p>
            </div>
          ) : (
            <div className="col-9 col-sm-7 col-md-9 mx-auto">
              <div className="row">
                {pokemon.map((poke, index) => {
                  if (index >= startOffset && startCount < perPage) {
                    startCount++;
                    return (
                      <div
                        className="col-12 col-sm-12 col-md-6 col-lg-4 p-1"
                        key={poke.id}
                      >
                        <PokemonCard pokemon={poke} />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
          {this.props.isAdmin ? (
            <Link to="/addpokemon">
              <button className="btn btn-info">ADD A NEW POKEMON</button>
            </Link>
          ) : (
            ""
          )}
        </div>
        <Paginating
          changePage={this.changePage}
          pages={pages}
          page={this.props.page}
          minusOnePage={this.minusOnePage}
          plusOnePage={this.plusOnePage}
          typeFilter={this.state.typeFilter}
          priceFilter={this.state.priceFilter}
          {...this.props}
        />
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  let pageNum = ownProps.history.location.search.length - 1;
  console.log("Paging", pageNum);
  return {
    pokemon: state.pokemon,
    isAdmin: state.user.admin,
    page:
      pageNum === -1
        ? 1
        : ownProps.history.location.search[pageNum - 1] === "="
          ? ownProps.history.location.search[pageNum]
          : Number(ownProps.history.location.search[pageNum]) + 10
  };
};

export default connect(mapState)(PokemonList);
