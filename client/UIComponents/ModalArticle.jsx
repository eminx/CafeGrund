import React from 'react';
import { Modal, Card, Avatar } from 'antd/lib';
import { PulseLoader } from 'react-spinners';
const { Meta } = Card;

const getInitials = string => {
  var names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

class ModalArticle extends React.Component {
  render() {
    const { isLoading, item, imageSrc } = this.props;

    return (
      <Modal {...this.props} style={{ top: 20 }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <PulseLoader loading />
          </div>
        ) : (
          <Card
            title={
              <div>
                <h1>{item.title}</h1>
              </div>
            }
            bordered={false}
          >
            <Meta
              avatar={<Avatar>{getInitials(item.authorName || 'ad')}</Avatar>}
              title={item.room || item.readingMaterial}
              description={item.longDescription || item.description}
              cover={imageSrc ? <img alt="image" src={imageSrc} /> : null}
            />
          </Card>
        )}
      </Modal>
    );
  }
}

export default ModalArticle;
