import { IconQrcode, IconTrash,IconEditCircle } from '@tabler/icons';

const icons = {
  IconQrcode,
  IconTrash,
  IconEditCircle
};

const code = {
  id: 'code',
  title: 'QR Generator',
  type: 'group',

  children: [
    {
      id: 'create-qr',
      title: 'Create QR ',
      type: 'item',
      url: '/create/qr/code',
      icon: icons.IconQrcode,

      // breadcrumbs: false
    },
    {
      id: 'manage-qr',
      title: 'Manage QR ',
      type: 'item',
      url: '/delete/qr/code',
      icon: icons.IconEditCircle,

      // breadcrumbs: false
    }
  ]
};
export default code;
