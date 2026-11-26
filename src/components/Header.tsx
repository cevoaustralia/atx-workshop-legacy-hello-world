import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends React.Component<any, any> {
  render() {
    const path = this.props.location.pathname;
    const linkStyle = (active: boolean) => ({
      color: active ? '#ff6600' : '#ffffff',
      marginLeft: '18px',
      textDecoration: 'none',
      fontWeight: active ? 'bold' : 'normal',
    });

    return (
      <div className="header">
        <span style={{ fontSize: '22px', fontWeight: 'bold' }}>👋 Hello World</span>
        <span style={{ float: 'right' }}>
          <Link to="/" style={linkStyle(path === '/')}>
            Home
          </Link>
          <Link to="/about" style={linkStyle(path === '/about')}>
            About
          </Link>
          <span style={{ marginLeft: '18px', color: '#ffcc00' }}>Hellos: {this.props.helloCount}</span>
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({ helloCount: state.helloCount });

export default connect(mapStateToProps)(withRouter(Header));
