
import { __ } from '@wordpress/i18n';
import React from "react";

const { PanelBody, Button,  __experimentalInputControl : InputControl } = wp.components;
const { registerPlugin } = wp.plugins;
const { PluginSidebar } = wp.editPost;


import { useEffect, useState } from '@wordpress/element';
import { blockIcon } from './utils/icons';
import useWPAjax from './utils/useWPAjax';



registerPlugin('osm-key', {
    icon: blockIcon.src,
    render: () => {

        const [apiKey, setApiKey] = useState(null);

        const { data, saveData, isLoading, error } = useWPAjax('open_stream_api_key', { nonce: window.wpApiSettings.nonce }, true)
        
        useEffect(() => {
            if(!isLoading && data){
                setApiKey(data);
            }
        }, [isLoading, data])



        useEffect(() => {
            // console.log({data, error});
            // refetch();
        }, [isLoading])




        const onSaveData = () => {
            if(!isLoading){
                saveData({
                    name: 'tanin rahman',
                    apiKey
                })
            }
        }

        return <PluginSidebar className='bPlPluginSidebar' title={__('MailChimp', 'mail-collections')}>

<PanelBody className='bPlPanelBody mcbPanelBody' title={__('Connection', 'mail-collections')} initialOpen={true}>
                <div className="configHelp">
                    <InputControl className="mcbInputControl" value={apiKey} onChange={val => setApiKey(val)} />
                </div>
                <Button className='apiBtn button button-primary' disabled={isLoading} onClick={onSaveData} >{__('Save Information', 'mail-collections')}</Button>

            </PanelBody>
       
    </PluginSidebar>
    }
});