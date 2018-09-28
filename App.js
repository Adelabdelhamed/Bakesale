import React from 'react';
import { StyleSheet, Text, View, Animated, Easing, Dimensions } from 'react-native';
import ajax from './src/ajax';
import DealList from './src/components/DealList';
import DealDetail from './src/components/DealDetail';
import SearchBar from './src/components/SearchBar';

class App extends React.Component {
  titleXPos = new Animated.Value(0);
  state = {
    deals: [], 
    dealsFromSearch: [],
    currentDealId: null
  }
  animateTitle = (direction = 1) => {
    const width = Dimensions.get('window').width - 150;
    Animated.timing(
      this.titleXPos, 
      { toValue: direction * (width / 2),
         duration: 1000,
         easing: Easing.ease,
         }).start(({ finished }) => {
      if (finished) {
       this.animateTitle(-1 * direction);
      }
    });
  }
  async componentDidMount() {
    this.animateTitle();
   const deals = await ajax.fetchInitialDeals();
   this.setState({ deals });
  }
  searchDeals = async (searchTerm) => {
    let dealsFromSearch = [];
    if (searchTerm) {
      dealsFromSearch = await ajax.fetchDealsSearchResults(searchTerm);
    }
        this.setState({ dealsFromSearch });
  }
  setCurrentDeal = (dealId) => {
   this.setState({
   currentDealId: dealId
 });
};
unsetCurrentDeal = () => {
  this.setState({
  currentDealId: null
});
};
currentDeal = () => {
  return this.state.deals.find((deal) => deal.key === this.state.currentDealId);
}
  render() {
    if (this.state.currentDealId) {
      return (
        <View style={styles.main}>
      <DealDetail
      initialDealData={this.currentDeal()}
      onBack={this.unsetCurrentDeal}
      />
      </View>
      );
    }
    const dealsToDisplay = 
    this.state.dealsFromSearch.length > 0
    ? this.state.dealsFromSearch
    : this.state.deals;
    if (dealsToDisplay.length > 0) {
      return (
        <View style={styles.main}>
          <SearchBar searchDeals={this.searchDeals} />
      <DealList 
      deals={dealsToDisplay} 
      onItemPress={this.setCurrentDeal} 
      />
      </View>
      );
    }
    return (
      <Animated.View style={[{ left: this.titleXPos }, styles.container]}>
        <Text style={styles.header}>BakeSale</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 40
  },
  main: {
    marginTop: 30
  }
});

export default App;
