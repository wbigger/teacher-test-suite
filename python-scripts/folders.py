# TODO: merge this file with quickstart.py

file_metadata = {
    'name': 'Invoices',
    'mimeType': 'application/vnd.google-apps.folder'
}
file = drive_service.files().create(body=file_metadata,
                                    fields='id').execute()
print 'Folder ID: %s' % file.get('id')