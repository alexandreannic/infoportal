import {Ip} from '@infoportal/api-sdk'

type Appearance = {
  name: string
  description: string
  questionTypes: (Ip.Form.QuestionType | string)[]
}

export const selectsQuestionTypes = ['select_one_from_file', 'select_one', 'select_multiple']
export const selectsQuestionTypesSet = new Set(selectsQuestionTypes)

export const appearances: Appearance[] = [
  {
    name: 'numbers',
    description: 'Restrict input to numeric symbols but save the value as text',
    questionTypes: ['text'],
  },
  {
    name: 'multiline',
    description: 'Show a text area that is multiple lines tall',
    questionTypes: ['text'],
  },
  {
    name: 'url',
    description: "Show a button to launch the website represented by this field's value",
    questionTypes: ['text'],
  },
  {
    name: 'ex:',
    description: 'Add the Android app ID of a custom application after the ex: prefix to launch that application',
    questionTypes: [
      'text',
      'integer',
      'decimal',
      'image',
      // 'audio', 'video',
      'file',
    ],
  },
  {
    name: 'thousands-sep',
    description: 'Automatically add locale-dependent thousands separators on screen but not in submissions',
    questionTypes: ['integer', 'decimal', 'text'],
  },
  {
    name: 'bearing',
    description: 'Prompt the user to capture the device-reported compass direction',
    questionTypes: ['decimal'],
  },
  {
    name: 'vertical',
    description: 'Show a vertical range slider instead of the default horizontal slider',
    questionTypes: [
      // 'range'
    ],
  },
  {
    name: 'no-ticks',
    description: 'Hide tick marks for a range slider (can combine with vertical)',
    questionTypes: ['range'],
  },
  {
    name: 'picker',
    description: 'Show values in a range as a list of options that can be picked',
    questionTypes: ['range'],
  },
  {
    name: 'rating',
    description: 'Show values in a range as star ratings',
    questionTypes: ['range'],
  },
  {
    name: 'new',
    description: 'Only show the option to capture new media, not to select existing',
    questionTypes: ['image', 'audio', 'video'],
  },
  {
    name: 'new-front',
    description: 'Only show the option to capture a new picture from front (selfie) camera',
    questionTypes: ['image'],
  },
  {
    name: 'draw',
    description: 'Prompt the user to draw an image',
    questionTypes: ['image'],
  },
  {
    name: 'annotate',
    description: 'Prompt the user to annotate (draw on) an image',
    questionTypes: ['image'],
  },
  {
    name: 'signature',
    description: 'Prompt the user to sign their signature',
    questionTypes: ['image'],
  },
  {
    name: 'no-calendar',
    description: 'Show date picker as spinners rather than a calendar',
    questionTypes: ['date', 'datetime'],
  },
  {
    name: 'month-year',
    description: 'Show date picker for month and year only',
    questionTypes: ['date'],
  },
  {
    name: 'year',
    description: 'Show date picker for year only',
    questionTypes: ['date'],
  },
  {
    name: 'ethiopian',
    description: 'Show date picker using the Ethiopian calendar',
    questionTypes: ['date'],
  },
  {
    name: 'coptic',
    description: 'Show date picker using the Coptic calendar',
    questionTypes: ['date'],
  },
  {
    name: 'islamic',
    description: 'Show date picker using the Islamic calendar',
    questionTypes: ['date'],
  },
  {
    name: 'bikram-sambat',
    description: 'Show date picker using the Bikram Sambat (Nepali) calendar',
    questionTypes: ['date'],
  },
  {
    name: 'myanmar',
    description: 'Show date picker using the Myanmar calendar',
    questionTypes: ['date'],
  },
  {
    name: 'persian',
    description: 'Show date picker using the Persian calendar',
    questionTypes: ['date'],
  },
  {
    name: 'placement-map',
    description: 'Show a map that the user can manually place and adjust a location on',
    questionTypes: ['geopoint'],
  },
  {
    name: 'maps',
    description: 'Show a map that the user can capture device location on (but not manually adjust)',
    questionTypes: ['geopoint'],
  },
  {
    name: 'hide-input',
    description: 'Show a larger map and hide geo input fields by default',
    questionTypes: ['geopoint', 'geotrace', 'geoshape'],
  },
  {
    name: 'minimal',
    description: 'Show a text prompt that when tapped shows all choices',
    questionTypes: selectsQuestionTypes,
  },
  {
    name: 'search',
    description: 'Allow the user to search the list of available choices',
    questionTypes: selectsQuestionTypes,
  },
  {
    name: 'quick',
    description: 'Advance to the next screen immediately after a choice is selected',
    questionTypes: ['select_one', 'select_one_from_file'],
  },
  {
    name: 'columns-pack',
    description: 'Show available choices with as may as possible on one line',
    questionTypes: selectsQuestionTypes,
  },
  {
    name: 'columns',
    description: 'Show available choices in 2, 3, 4 or 5 columns depending on screen size',
    questionTypes: selectsQuestionTypes,
  },
  {
    name: 'columns-n',
    description: 'Show available choices in the specified number (n) of columns',
    questionTypes: selectsQuestionTypes,
  },
  {
    name: 'no-buttons',
    description: 'Show available choices without radio buttons / check boxes',
    questionTypes: selectsQuestionTypes,
  },
  {
    name: 'image-map',
    description: 'Show available choices mapped to the svg file specified in the image column',
    questionTypes: selectsQuestionTypes,
  },
  {
    name: 'likert',
    description: 'Show available choices horizontally as a likert scale',
    questionTypes: ['select_one', 'select_one_from_file'],
  },
  {
    name: 'map',
    description: "Show available choices on a map using each choice's geometry column",
    questionTypes: ['select_one', 'select_one_from_file'],
  },
  {
    name: 'field-list',
    description: 'Show all questions in the field list on the same screen',
    questionTypes: ['begin_group', 'begin_repeat'],
  },
  {
    name: 'label',
    description: 'Show only option labels to define the top row of a select grid',
    questionTypes: selectsQuestionTypes,
  },
  {
    name: 'list-nolabel',
    description: 'Show only radio buttons or checkboxes to define the inside of a select grid',
    questionTypes: selectsQuestionTypes,
  },
  {
    name: 'list',
    description: 'Show horizontal radio buttons or checkboxes with their labels',
    questionTypes: selectsQuestionTypes,
  },
  {
    name: 'table-list',
    description: 'Shortcut for building a grid of list and list-nolabel questions with a title',
    questionTypes: ['begin_group'],
  },
  {
    name: 'hidden-answer',
    description: 'Hides the scanned barcode value',
    questionTypes: ['barcode'],
  },
  {
    name: 'printer',
    description: 'Send the value of the question to the printer app for preview and printing',
    questionTypes: ['text'],
  },
  {
    name: 'masked',
    description: 'Show asterisks (*) instead of what the user is entering',
    questionTypes: ['text'],
  },
  {
    name: 'counter',
    description: 'Show buttons for incrementing and decrementing',
    questionTypes: ['integer'],
  },
]
