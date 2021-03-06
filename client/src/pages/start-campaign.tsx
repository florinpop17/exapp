import React from 'react'
import { CreateCampaignForm } from '../modules/campaigns/createCampaignForm'
import { container, IInjectedProps } from '../utils/decorators'

const StartCampaign = container(
    class extends React.Component<IInjectedProps> {
        constructor(props) {
            super(props)
        }
        public render() {
            return (
                <div className="container">
                    <CreateCampaignForm />
                </div>
            )
        }
    }
)
export default StartCampaign
