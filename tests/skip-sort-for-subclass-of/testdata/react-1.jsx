import * as React from 'react';

class MyComponent extends
React.Component {
    state = {
serverUrl: 'https://localhost:1234'
    };

    componentDidMount() {
        this.setupConnection();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.roomId !== prevProps.roomId ||
            this.state.serverUrl !== prevState.serverUrl
        ) {
            this.destroyConnection();
            this.setupConnection();
        }
    }

    render() {
        return null;
    }
    
    onClick() {}
}
