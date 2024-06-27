import React from 'react';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const StylesSettings = () => {
  return (
    <div>
      <PanelBody title={__('Styles here', 'open-street-map')} initialOpen={false}>
          
      </PanelBody>
    </div>
  );
};

export default StylesSettings;