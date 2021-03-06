import { computed } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { AuthenticatedUserPageLayout } from './modules/layout/AuthenticatedUserPageLayout'
import { CoreLayout } from './modules/layout/CoreLayout'
import { LandingPageLayout } from './modules/layout/LandingPageLayout'
import { BrowserRouter, Route } from 'react-router-dom'
import AccountDashboard from './pages/account-dashboard'
import LandingPage from './pages/index'
import { hot } from 'react-hot-loader'

@observer
@hot(module)
export default class Exapp extends React.Component {
    @computed
    get pageLayout() {
        // Add here funky logic to determine what layout to use
        const currentRoute = window.location.pathname
        switch (currentRoute) {
            case '/':
                return LandingPageLayout
            default:
                return AuthenticatedUserPageLayout
        }
    }
    public render() {
        const PageLayout = this.pageLayout
        return (
            <CoreLayout>
                <BrowserRouter>
                    <PageLayout>
                        <div>
                            <div className="content">
                                <Route exact path="/" component={LandingPage} />
                                <Route
                                    exact
                                    path="/account-dashboard"
                                    component={AccountDashboard}
                                />
                            </div>
                        </div>
                    </PageLayout>
                </BrowserRouter>
            </CoreLayout>
        )
    }
}
