import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd/lib';
import moment from 'moment';

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class PublicActivityThumb extends React.Component {
  getEventTimes = event => {
    if (!event) {
      return;
    }

    if (event.isMultipleDay || event.isFullDay) {
      return (
        moment(event.startDate).format('Do MMM') +
        ' ' +
        event.startTime +
        ' – ' +
        moment(event.endDate).format('Do MMM') +
        ' ' +
        event.endTime
      );
    } else if (event.startTime) {
      return `${event.startTime}–${event.endTime} ${moment(
        event.startDate
      ).format('DD MMMM')}`;
    } else {
      return '';
    }
  };

  renderDate = date => {
    if (!date) {
      return;
    }

    const sameStyle = {
      color: '#fff',
      fontWeight: 700,
      lineHeight: 1
    };

    return (
      <div
        key={date.startDate + date.startTime}
        style={{ marginRight: 16, marginBottom: 16 }}
      >
        <div style={{ ...sameStyle, fontSize: 24 }}>
          {moment(date.startDate).format('DD')}
        </div>
        <div style={{ ...sameStyle, fontSize: 15 }}>
          {moment(date.startDate)
            .format('MMM')
            .toUpperCase()}
        </div>
      </div>
    );
  };

  render() {
    const { item, isAttending, isMyEventWTF, currentUser } = this.props;
    const eventTimes = this.getEventTimes(item);

    const thumbStyle = {
      position: 'relative',
      flexBasis: 300,
      flexShrink: 0,
      flexGrow: 1,
      minHeight: 240
    };

    const commonStyle = {
      color: '#fff',
      fontWeight: 300,
      lineHeight: 1
    };

    const coverStyle = {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      backgroundImage: `url('${item.imageUrl}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      filter: 'brightness(50%)'
    };

    let clickLink = `/event/${item._id}`;

    return (
      <div style={thumbStyle}>
        <Link to={clickLink}>
          <div style={coverStyle} />
          <div style={{ position: 'relative', padding: '24px 16px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {item.datesAndTimes.map(date => this.renderDate(date))}
            </div>
            <h3 style={{ ...commonStyle, fontSize: 24, marginBottom: 6 }}>
              {item.title}
            </h3>
            <h4 style={{ ...commonStyle, fontSize: 16 }}>{item.subTitle}</h4>
          </div>
        </Link>
      </div>
    );
  }
}

export default PublicActivityThumb;