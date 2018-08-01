import React, { Component }                     from 'react';
import PropTypes                                from 'prop-types';
import { Modal, Header, Button, List, Message } from 'semantic-ui-react';

export default class ViewsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seriesStorages: this.setSeriesStorages(props.currentSeriesStorages),
    }
  }

  static propTypes = {
    handleClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  }

  componentWillReceiveProps(nextProps) => {
    const isSeriesStoragesChanged = nextProps.currentSeriesStorages !== this.props.currentSeriesStorages;

    if (isSeriesStoragesChanged) {
      this.setSeriesStorages(nextProps.currentSeriesStorages);
    }
  }

  setSeriesStorages = (currentSeriesStorages) => {
    const { selectOptions } = this.props;

    const reduced = currentSeriesStorages.reduce((acc, currentStorage) => {
      const { text } = selectOptions.seriesStorages.find((storage) => {
        return storage.id === currentStorage;
      }) || { text: undefined };

      if (text) {
        return { ...acc, [text]: currentStorage };
      }

      return acc;
    }, {});

    this.setState({ seriesStorages: reduced });
  }

  handleUpdateViews = (seriesStorage) => (e) => {
    const { handleUpdateViews } = this.props;
    handleUpdateViews(e, seriesStorage);
  }

  render() {
    const { seriesStorages } = this.state;

    const {
      open,
      handleClose,
      t,
      handleResetErrors,
      errors,
      loading,
    } = this.props;

    return (
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Header
          content={t['viewsModal.header']}
        />
        <Modal.Content>
          {errors.length !== 0
            &&
            <Message
              onDismiss={handleResetErrors}
              negative
            >
              <Message.Header>{t['common.error']}</Message.Header>
              {
                errors.map((item, id) => {
                  return <p key={id}>{item}</p>;
                })
              }
            </Message>
          }
          { seriesStorages
            &&
            <List
              divided
            >
              { Object.keys(seriesStorages).map((item, id) => (
                <List.Item
                  key={id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <List.Content
                    style={{ flex: 1 }}
                  >
                    {item}
                  </List.Content>
                  <List.Content>
                    <Button
                      onClick={this.handleUpdateViews(seriesStorages[item])}
                      loading={loading}
                      disabled={loading}
                    >
                      {t['viewsModal.buttons.update']}
                    </Button>
                  </List.Content>
                </List.Item>
              ))
            }
            </List>
          }
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={handleClose}
          >
            {t['viewsModal.buttons.close']}
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
