import React from "react";
import { connect } from "react-redux";
import { fetchOrders } from '../../store/order';
import Order from './order'

class Orders extends React.Component {
  componentDidMount() {
    this.props.fetchOrders();
  }

  render() {
    let orders;

    if (this.props.user.admin) {
      orders = this.props.orders
    } else {
        orders = this.props.orders.filter(
          order => order.user.id === this.props.user.id
        );
    }

    console.log(this.props);

    return (
      <div>
        <h4>Orders</h4>

        {orders.length === 0 && <div>You have no orders...</div>}

        {orders.map((order, key) => <Order  order={order} key={key}/>)}
      </div>
    );
  }
}

const mapState = state => {
  return {
    orders: state.orders,
    user: state.user
  };
};

const mapDispatch = dispatch => {
  return {
    fetchOrders: () => dispatch(fetchOrders())
  }
};

export default connect(mapState, mapDispatch)(Orders);