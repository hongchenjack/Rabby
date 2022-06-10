import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from 'ui/component';
import { useWallet } from 'ui/utils';
import './style.less';
import { InfoCircleOutlined } from '@ant-design/icons';
import QRCode from 'qrcode.react';
import { Button } from 'antd';
import IconMaskIcon from '@/ui/assets/create-mnemonics/mask-lock.svg';
import IconCopy from 'ui/assets/component/icon-copy.svg';
import IconSuccess from 'ui/assets/success.svg';
import { message } from 'antd';
import { copyTextToClipboard } from '@/ui/utils/clipboard';
import clsx from 'clsx';
import WordsMatrix from '@/ui/component/WordsMatrix';
import { useHistory, useLocation } from 'react-router-dom';

const AddressBackup = () => {
  const wallet = useWallet();
  const { t } = useTranslation();

  const history = useHistory();
  const { state } = useLocation<{
    data: string;
  }>();

  const data = state?.data;
  const [masked, setMasked] = useState(true);

  const onCopyMnemonics = React.useCallback(() => {
    copyTextToClipboard(data).then(() => {
      message.success({
        icon: <img src={IconSuccess} className="icon icon-success" />,
        content: t('Copied'),
        duration: 0.5,
      });
    });
  }, [data]);

  useEffect(() => {
    if (!data) {
      history.goBack();
    }
  }, [data, history]);

  if (!data) {
    return null;
  }

  return (
    <div className="page-address-backup">
      <header>Backup Seed Phrase</header>
      <div className="alert mb-[34px]">
        <InfoCircleOutlined />
        The Seed Phrase is your asset credentials, which will be lost if lost or
        known by others. Please view it in a secure environment and keep it
        carefully.
      </div>
      <div className="mb-[84px]">
        <div className="relative">
          <div
            onClick={() => setMasked(false)}
            className={clsx('mask', !masked && 'hidden')}
          >
            <img src={IconMaskIcon} className="w-[44px] h-[44px]" />
            <p className="mt-[16px] mb-0 text-white">
              {t('Click to show Seed Phrase')}
            </p>
          </div>
          <div
            className="rounded-[6px] flex items-center w-full"
            style={masked ? { filter: 'blur(3px)' } : {}}
          >
            <WordsMatrix
              className="w-full"
              focusable={false}
              closable={false}
              words={data.split(' ')}
            />
          </div>
        </div>
        <div
          onClick={onCopyMnemonics}
          className={clsx('copy', masked ? 'invisible' : 'visible')}
        >
          <img src={IconCopy} />
          {'Copy seed phrase'}
        </div>
      </div>
      <div className="footer">
        <Button
          type="primary"
          size="large"
          className="w-[200px]"
          onClick={() => history.goBack()}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};

export default AddressBackup;
