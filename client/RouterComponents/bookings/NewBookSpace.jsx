import React from 'react';
import CreateBookingForm from '../../UIComponents/CreateBookingForm';
import ModalArticle from '../../UIComponents/ModalArticle';
import { Row, Col, message, Alert, Switch, Divider, Affix } from 'antd/lib';
import { Redirect } from 'react-router-dom';

const successCreation = () => {
  message.success('Your booking is successfully created', 6);
};

const sideNote =
  "Please check if a corresponding time and space is not taken already. \n It is your responsibility to make sure that there's no overlapping bookings.";

class NewBookSpace extends React.Component {
  state = {
    modalConfirm: false,
    values: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    newBookingId: null,
    uploadedImage: null,
    uploadableImage: null,
    isPublicActivity: false,
    isBookingsDisabled: false,
    numberOfRecurrence: 1
  };

  registerGatheringLocally = values => {
    values.authorName = this.props.currentUser.username || 'emo';

    this.setState({
      values,
      modalConfirm: true
    });
  };

  setUploadableImage = e => {
    const theImageFile = e.file.originFileObj;
    const reader = new FileReader();
    reader.readAsDataURL(theImageFile);
    reader.addEventListener(
      'load',
      () => {
        this.setState({
          uploadableImage: theImageFile,
          uploadableImageLocal: reader.result
        });
      },
      false
    );
  };

  uploadImage = () => {
    this.setState({ isLoading: true });

    const { uploadableImage } = this.state;

    const upload = new Slingshot.Upload('activityImageUpload');

    upload.send(uploadableImage, (error, downloadUrl) => {
      if (error) {
        console.error('Error uploading:', error);
      } else {
        this.setState(
          {
            uploadedImage: downloadUrl
          },
          () => this.createBooking()
        );
      }
    });
  };

  createBooking = () => {
    const {
      values,
      isPublicActivity,
      isBookingsDisabled,
      uploadedImage
    } = this.state;

    values.isPublicActivity = isPublicActivity;
    values.isBookingsDisabled = isBookingsDisabled;

    Meteor.call('createBooking', values, uploadedImage, (error, result) => {
      if (error) {
        console.log('error', error);
        this.setState({
          isLoading: false,
          isError: true
        });
      } else {
        this.setState({
          isLoading: false,
          newBookingId: result,
          isSuccess: true
        });
      }
    });
  };

  hideModal = () => this.setState({ modalConfirm: false });
  showModal = () => this.setState({ modalConfirm: true });

  handlePublicActivitySwitch = value => {
    this.setState({
      isPublicActivity: value
    });
  };

  handleDisableBookingsSwitch = value => {
    this.setState({
      isBookingsDisabled: value
    });
  };

  redirectSuccess = () => {
    const { isPublicActivity, newBookingId } = this.state;
    successCreation();
    if (isPublicActivity) {
      return <Redirect to={`/activity/${newBookingId}`} />;
    } else {
      return <Redirect to={`/calendar`} />;
    }
  };

  render() {
    const { currentUser } = this.props;

    if (!currentUser || !currentUser.isRegisteredMember) {
      return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Alert
            message="You have to become a registered member to create a booking."
            type="error"
          />
        </div>
      );
    }

    const {
      modalConfirm,
      values,
      isLoading,
      isSuccess,
      newBookingId,
      uploadedImage,
      uploadableImage,
      uploadableImageLocal,
      isPublicActivity,
      isBookingsDisabled,
      numberOfRecurrence
    } = this.state;

    return (
      <div style={{ padding: 24 }}>
        <h2>Create a Booking or Public Event</h2>
        <Row gutter={48}>
          <Col xs={24} sm={24} md={16}>
            <Row>
              <Col md={12}>
                <h4>public event?</h4>
                <Switch
                  checked={isPublicActivity}
                  onChange={this.handlePublicActivitySwitch}
                />
              </Col>
              {isPublicActivity && (
                <Col md={12}>
                  <h4>bookings disabled?</h4>
                  <Switch
                    checked={isBookingsDisabled}
                    onChange={this.handleDisableBookingsSwitch}
                  />
                </Col>
              )}
            </Row>

            <Divider />
            <CreateBookingForm
              values={values}
              registerGatheringLocally={this.registerGatheringLocally}
              setUploadableImage={this.setUploadableImage}
              uploadableImage={this.state.uploadableImage}
              places={this.props.places}
              isPublicActivity={isPublicActivity}
              currentUser={currentUser}
              numberOfRecurrence={numberOfRecurrence}
            />
          </Col>
        </Row>
        {modalConfirm ? (
          <ModalArticle
            item={values}
            isLoading={isLoading}
            title="Overview The Information"
            visible={modalConfirm}
            onOk={isPublicActivity ? this.uploadImage : this.createBooking}
            onCancel={this.hideModal}
            okText="Confirm"
            cancelText="Go back and edit"
            imageSrc={uploadedImage}
          />
        ) : null}

        {isSuccess && this.redirectSuccess()}
      </div>
    );
  }
}

export default NewBookSpace;
