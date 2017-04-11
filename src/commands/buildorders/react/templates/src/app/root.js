import { Router } from 'react-router'
import routes     from './routes.js'

export default class Root extends React.Component {
  static propTypes = {
    history: React.PropTypes.object,
  }

  render() {
    return <Router
      history={this.props.history}
      routes={routes}
    />
  }
}