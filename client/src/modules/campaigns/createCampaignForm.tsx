import React from 'react'
import { container, IInjectedProps } from '../../utils/decorators'
import { Button, FloatingInput } from '../elements'
import { RichTextEditor } from '../elements/rich-text'

export const CreateCampaignForm = container(
    class extends React.Component<IInjectedProps> {
        constructor(props) {
            super(props)
        }
        public render() {
            const {
                t,
                appStore: { createCampaignFormStore },
            } = this.props

            return (
                <div>
                    <h1>{t('startCampaign.campaignInfoTitle')}</h1>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label className="h4">Title</label>
                                <FloatingInput
                                    name="campaignTitle"
                                    id="campaignTitle"
                                    placeholder="Type a campaign title"
                                    onChange={ev =>
                                        createCampaignFormStore.onTitleChange(
                                            ev.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="form-group">Test</div>
                        </div>
                        <div className="col-sm-8">
                            <div className="form-group">
                                <label className="h4">Description</label>
                                <RichTextEditor
                                    onChange={
                                        createCampaignFormStore.onDescriptionChange
                                    }
                                    placeholder="A detailed description of campaigns goals"
                                />
                            </div>
                            <div className="form-group">
                                <label className="h4">Short summary</label>
                                <textarea
                                    className="form-control"
                                    onChange={ev =>
                                        createCampaignFormStore.onSummaryChange(
                                            ev.target.value
                                        )
                                    }
                                    placeholder="A really short excerpt of what the campaign is about"
                                />
                            </div>
                            <div className="create-campaign-btn-container">
                                <Button
                                    onClick={
                                        createCampaignFormStore.onCreateCampaign
                                    }
                                    className="btn btn-md btn-purple"
                                >
                                    Create campaign
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
)
