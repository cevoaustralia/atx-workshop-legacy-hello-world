import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { connect } from 'react-redux';

class Header extends React.Component<any, any> {
  render() {
    const path = this.props.pathname;
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

// Wrapper to inject TanStack Router location
function HeaderWrapper(props: any) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return <Header {...props} pathname={pathname} />;
}

const mapStateToProps = (state: any) => ({ helloCount: state.helloCount });

export default connect(mapStateToProps)(HeaderWrapper);
