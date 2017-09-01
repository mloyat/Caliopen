import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ManageTags from './ManageTags';
import Spinner from '../../components/Spinner';
import ContactDetails from '../../components/ContactDetails';
import ContactProfile from '../../components/ContactProfile';
import Modal from '../../components/Modal';
import MenuBar from '../../components/MenuBar';
import Button from '../../components/Button';
import { UPDATE_CONTACT_SUCCESS } from '../../store/modules/contact';

import './style.scss';

const noop = str => str;

class Contact extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
    requestContact: PropTypes.func.isRequired,
    updateContact: PropTypes.func.isRequired,
    notifyError: PropTypes.func.isRequired,
    removeContact: PropTypes.func,
    contactId: PropTypes.string.isRequired,
    contact: PropTypes.shape({}),
    isFetching: PropTypes.bool,
  };

  static defaultProps = {
    isFetching: false,
    removeContact: noop,
    contact: undefined,
  };

  state = {
    isTagModalOpen: false,
  };

  componentDidMount() {
    const { contactId, requestContact } = this.props;
    requestContact({ contactId });
  }

  handleContactChange = ({ contact, original }) => {
    const { __, updateContact, notifyError, requestContact } = this.props;

    updateContact({ contact, original })
      .then((action) => {
        if (action.type === UPDATE_CONTACT_SUCCESS) {
          return requestContact({ contactId: contact.contact_id });
        }

        return notifyError(__('contact.feedback.update-fail'));
      })
    ;
  }

  handleContactDelete = ({ contact }) => {
    this.props.removeContact({ contact });
  }

  handleClickTags = () => {
    this.setState({ isTagModalOpen: true });
  }

  handleCloseTagsModal = () => {
    this.setState({ isTagModalOpen: false });
  }

  renderTagsModal() {
    const { contact, updateContact, __ } = this.props;
    const count = contact.tags ? contact.tags.length : 0;
    const title = (
      <span>{__('tags.header.title')}
        <span className="m-tags-form__count">
          {__('tags.header.count', { count }) }
        </span>
      </span>);

    return (
      <Modal
        isOpen={this.state.isTagModalOpen}
        contentLabel={__('tags.header.title')}
        title={title}
        onClose={this.handleCloseTagsModal}
      >
        <ManageTags contact={contact} onContactChange={updateContact} />
      </Modal>
    );
  }

  render() {
    const { __, isFetching, contact } = this.props;

    return (
      <div>
        {contact && (
          <MenuBar className="s-contact__menu-bar">
            <Button
              onClick={this.handleContactDelete}
              responsive="icon-only"
              icon="trash"
            >{__('contact.action.delete_contact')}</Button>
            <Button
              onClick={this.handleClickTags}
              responsive="icon-only"
              icon="tags"
            >{__('contact.action.edit_tags')}</Button>
            {this.renderTagsModal()}
          </MenuBar>
        )}
        <Spinner isLoading={isFetching} />
        {
          contact && (
          <div className="s-contact">
            <div className="s-contact__col-datas-irl">
              {contact && (
                <ContactProfile
                  contact={contact}
                  onChange={this.handleContactChange}
                />
              )}
            </div>
            <div className="s-contact__col-datas-online">
              <ContactDetails
                contact={contact}
                onUpdateContact={this.handleContactChange}
                __={__}
              />
            </div>
          </div>
          )
        }
      </div>
    );
  }
}

export default Contact;