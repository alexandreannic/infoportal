import {formatDistance, formatDuration as formatDurationFns} from 'date-fns'
import {appConfig} from '@/conf/AppConfig'
import {capitalize, OblastIndex, OblastISO} from '@infoportal-common'

const invalidDate = ''

export const isDateValid = (d?: Date): boolean => {
  return !!d && d instanceof Date && !isNaN(d.getTime())
}

export const formatDate = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return d!.toLocaleDateString()
}

export const formatTime = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return d!.toLocaleTimeString()
}

export const formatDateTime = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return formatDate(d) + ' ' + formatTime(d)
}

export const dateFromNow: {
  (d: Date): string
  (d?: undefined): undefined
  (d?: Date): string | undefined
} = (d) => {
  return d ? formatDistance(d, new Date(), {addSuffix: true}) : undefined as any
}

export const formatLargeNumber = (n?: number, options?: Intl.NumberFormatOptions): string => {
  return n !== undefined && n !== null && !isNaN(n) ? n.toLocaleString('en-EN', options) : '-'
}

export const formatDuration = formatDurationFns

export type Messages = typeof en['messages']

export const en = Object.freeze({
  formatDate,
  formatTime,
  formatDateTime,
  dateFromNow,
  formatDuration,
  formatLargeNumber,
  messages: {
    snapshot: 'Snapshot',
    invalid: 'Invalid',
    others: 'Others',
    other: 'Other',
    majorStressFactors: 'Major stress factors',
    exist: 'Exist',
    notExist: 'Not exist',
    area: 'Area',
    men: 'Men',
    activities: 'Activities',
    noComment: 'No comment',
    answers: 'Answers',
    seeResults: `See results`,
    updating: 'Updating',
    users: 'Users',
    select3Outcomes: `Please, select 3 outcomes`,
    oblast: 'Oblast',
    edit: 'Edit',
    type: 'Type',
    editKobo: `Edit (⚠️ This is an unstable feature. Use it only if you have proper permission. It's still useful for viewing data from the Kobo interface).`,
    apply: 'Apply',
    clear: 'Clear',
    custom: 'Custom',
    close: 'Close',
    reinitialize: 'Reinitialize',
    connectAs: 'Connect as',
    focalPoint: 'Focal point',
    budget: 'Budget',
    project: 'Project',
    column: 'Column',
    name: 'Name',
    violence: 'Violence',
    copyingMechanisms: 'Coping mechanisms',
    female: 'Female',
    settlement: 'Settlement',
    by: 'By',
    hhs: 'HHs',
    accessLevel: 'Access level',
    females: 'Females',
    paidOn: 'Paid on',
    lastStatusUpdate: 'Last status update',
    adultMen: 'Adult men',
    adultWomen: 'Adult women',
    boy: 'Boy',
    modality: 'Modality',
    girl: 'Girl',
    save: 'Save',
    somethingWentWrong: 'Something went wrong',
    yes: 'Yes',
    influencingFactors: 'Influencing factors',
    familyUnity: 'Family unity',
    city: 'City',
    no: 'No',
    contactAdmin: 'Contact:',
    office: 'Office',
    enumerator: 'Enumerator',
    disaggregation: 'Disaggregation',
    drcOffice: 'DRC office',
    question: 'Question',
    _ageGroup: {
      Quick: 'Quick',
      DRC: 'DRC',
      ECHO: 'ECHO',
      BHA: 'BHA',
      UNHCR: 'UNHCR',
    },
    kobo: 'Kobo',
    answer: 'Answer',
    calculations: 'Calculations',
    value: 'Value',
    percent: 'Percent',
    Flagged: 'Flagged',
    UnderReview: 'UnderReview',
    Pending: 'Pending',
    history: 'History',
    recap: 'Recap',
    Approved: 'Approved',
    updatingTag: (rowsCount: number, key: string, value: string) => `Updating ${key}=${value} on ${rowsCount} rows...`,
    cannotUpdateTag: (rowsCount: number, key: string, value: string) => `Update failed for ${key}=${value} on ${rowsCount} rows. Table not edited.`,
    Rejected: 'Rejected',
    mykolaiv: 'Mykolaiv',
    lastConnectedAt: 'Last connection',
    validation: 'Validation',
    onlyPwds: 'Only PwDs',
    consideredAsPwd: 'Are not considered PwDs when the level of difficulty is not set or set to "No, no difficulty".',
    perpetrators: 'Perpetrators',
    kyiv: 'Kyiv',
    view: 'View',
    continue: 'Continue',
    viewData: 'View data',
    theme: 'Dark theme',
    format: 'Format',
    previous: 'Previous',
    filter: 'Filter',
    distinct: 'Distinct',
    noneFormatted: '<i>None</i>',
    none: '<i>None</i>',
    filterPlaceholder: 'Filter...',
    count: 'Count',
    sum: 'Sum',
    average: 'Average',
    min: 'Min',
    max: 'Max',
    disabilities: 'Disabilities',
    minors: 'Minors',
    editAgain: 'Edit again',
    children: 'Children',
    PwD: 'PwD',
    PwDs: 'PwDs',
    next: 'Next',
    clearFilter: 'Clear filter',
    logout: 'Logout',
    youDontHaveAccess: `You don't have access. Contact alexandre.annic@drc.ngo`,
    share: 'Share',
    refresh: 'Refresh',
    refreshTable: 'Refresh current data',
    grantAccess: 'Grant access',
    title: 'Information Management Portal',
    noDataAtm: 'No data at the moment',
    fileName: 'File name',
    subTitle: 'Ukraine',
    signIn: 'Sign-in',
    committed: 'Committed',
    pending: 'Pending',
    rejected: 'Rejected',
    blank: 'Blank',
    suggestion: 'Suggestion',
    signInDesc: 'With your DRC Microsoft account',
    viewDate: `View data`,
    information: 'Information',
    koboData: `Kobo data`,
    activity: 'Activity',
    previewActivity: `Preview activity`,
    previewRequestBody: `Preview request body code`,
    nLines: (n: number) => `<b>${n}</b> lignes`,
    confirm: 'Confirm',
    downloadAsXLS: 'Download as XLS',
    downloadAsPdf: 'Download as PDF',
    all: 'All',
    details: 'Details',
    toggleDatatableColumns: 'Show/hide columns',
    areas: {
      north: 'North',
      east: 'East',
      south: 'South',
      west: 'West'
    },
    paid: 'Paid',
    start: 'Start',
    submissionStart: 'Submission start',
    end: 'End',
    filters: 'Filters',
    endIncluded: 'End (included)',
    typeOfSite: 'Type of site',
    version: 'Version',
    error: 'Error',
    create: 'Create',
    proxy: 'Proxy',
    enabled: 'Enabled',
    households: 'Households',
    hhType: 'HH Type',
    displacementStatus: 'Displacement status',
    householdStatus: 'Household Status',
    individuals: 'Individuals',
    uniqIndividuals: 'Unique individuals',
    submissions: 'Submissions',
    householdSize: 'Household size',
    occurrences: 'Occurrences',
    hhSize: 'HH size',
    dashboard: 'Dashboard',
    loading: 'Loading',
    passportSerie: 'Passport serie',
    price: 'Price',
    passportNumber: 'Passport number',
    taxIdOccurrences: 'Tax ID occurrences',
    phoneOccurrences: 'Phone occurrences',
    taxID: 'Tax ID',
    submittedAt: 'Submitted at',
    clearAll: 'Clear all',
    committedAt: 'Committed at',
    id: 'ID',
    back: 'Back',
    access: 'Access',
    accesses: 'Accesses',
    url: 'URL',
    confirmRemove: 'Confirm remove',
    expireAt: 'Expire at',
    slug: 'Slug',
    try: 'Try',
    category: 'Category',
    origin: 'Origin',
    destination: 'Destination',
    invalidUrl: 'Invalid URL',
    mainConcerns: 'Main concern',
    accommodationCondition: 'Accommodation condition',
    tenureOfAccommodation: 'Accommodation tenure',
    housingStructure: 'Accommodation structure',
    firstPriorityNeed: '1st Priority needs',
    secondPriorityNeed: '2nd Priority needs',
    thirdPriorityNeed: '3rd Priority needs',
    selected: 'Selected',
    phone: 'Phone',
    drcEmail: 'DRC Email',
    finance: 'Finance',
    decidingFactorsToReturn: 'Deciding factors to return',
    displacement: 'Displacement',
    originOblast: 'Oblast of origin',
    admin: 'Admin',
    idpOriginOblast: 'Origin oblast of IDPs',
    currentOblast: 'Current oblast',
    idpPopulationByOblast: 'IDP population by oblast of origin and displacement',
    age: 'Age',
    submitAll: 'Submit all',
    submit: 'Submit',
    hohhOlder: 'HoHH 60+',
    changeAccount: 'Change account',
    lastName: 'Last name',
    change: 'Change',
    successfullyEdited: (n: number) => `Successfully edited ${n} rows.`,
    housing: 'Housing',
    table: 'Table',
    comparedToTotalAnswers: 'Based on total answers:',
    chart: 'Chart',
    group: 'Group',
    required: 'Required',
    invalidEmail: 'Invalid email',
    eligibility: 'Eligibility',
    vulnerability: 'Vulnerability',
    confirmYourOffice: (office: string) => `Confirm ${office} office`,
    itCannotBeChanged: (admin: string) => `For privacy reasons, you will not be able to change it later without contacting ${admin}.`,
    select: 'Select',
    welcomePleaseSelectOffice: 'Welcome, select your DRC office:',
    firstName: 'First name',
    patronyme: 'Patronyme',
    data: 'Data',
    duplicate: 'Duplicate',
    duplication: 'Duplication',
    deduplication: 'Deduplication',
    wfpDeduplication: 'WFP Deduplication',
    deduplications: 'Deduplications',
    hohhFemale: 'HoHH female',
    vulnerabilities: 'Vulnerabilities',
    selectAll: 'Select all',
    ageGroup: 'Age groups',
    ratio: 'Ratio',
    koboSubmissionTime: 'Kobo submission',
    absolute: 'Absolute',
    contact: (_: string) => `Contact <b>${_}</b>.`,
    intentions: 'Intentions',
    sex: 'Sex',
    daily: 'Daily',
    monthly: 'Monthly',
    createdAt: 'Created at',
    visible: 'Visible',
    hidden: 'Hidden',
    updatedAt: 'Updated at',
    returnToThePlaceOfHabitualResidence: 'Return to the place of habitual residence',
    currentStatus: 'Current status',
    status: 'Status',
    male: 'Male',
    adults: 'Adults',
    elderly: 'Elderly',
    elderlyMale: 'Elderly male',
    elderlyFemale: 'Elderly female',
    selectForm: 'Select form',
    selectData: 'Select Data',
    ukraine: 'Ukraine',
    location: 'Location',
    submissionTime: 'Submission',
    submittedBy: 'By',
    add: 'Add',
    protectionMonitoringDashboard: 'Protection monitoring dashboard',
    undefined: 'Unknown',
    women: 'Women',
    avgAge: 'Avg. age',
    coveredOblasts: 'Covered oblasts',
    lackOfPersonalDoc: 'Individuals lacking personal documentation',
    lackOfHousingDoc: 'HHs lacking HLP documentation',
    sample: 'Sample overview',
    documentation: 'Documentation',
    livelihoods: 'Livelihoods',
    priorityNeeds: 'Priority Needs',
    hhWithoutIncome: 'No income',
    hhOutOfWork: 'Out of work',
    idpWithAllowance: 'IDPs w/ allowance',
    specificNeeds: 'Specific needs',
    propertyDamaged: 'Properties damaged due to conflict',
    email: 'Email',
    drcJob: 'DRC Job',
    intentionToReturn: 'Intention to return',
    hhWithGapMeetingBasicNeeds: 'Basic needs gaps',
    unemployedMemberByOblast: 'By oblast population',
    Access: {
      giveAccessBy: 'Grant access by',
      jobAndOffice: 'Job and Office',
    },
    hhCategoryType: {
      idp: 'IDP',
      hohh60: 'Elderly HoHH',
      hohhFemale: 'Female HoHH',
      memberWithDisability: 'HH with PwD',
      all: 'Average'
    },
    shelter: 'Shelter',
    health: 'Health',
    cash: 'Cash',
    levelOfPropertyDamaged: 'Level of damaged',
    mainSourceOfIncome: 'Main source of income',
    employmentType: 'Type of employment',
    monthlyIncomePerHH: 'Average monthly income per HH',
    HHsLocation: 'HHs Location',
    idp: 'IDP',
    overview: 'Overview',
    requests: 'Requests',
    selectADatabase: 'Select a Kobo form',
    noIdp: 'Non-IDP',
    comparedToPreviousMonth: (n: number) => `Compared to ${n} days ago`,
    idps: 'IDPs',
    nonDisplaced: 'Non-displaced',
    refugeesAndReturnees: 'Refugees and returnees',
    poc: 'Person of concern',
    global: 'Global',
    description: 'Description',
    createdBy: 'Created by',
    donor: 'Donor',
    gender: 'Gender',
    respondentGender: 'Respondent gender',
    respondent: 'Respondent',
    program: 'Program',
    progress: 'Progress',
    raion: 'Raion',
    relative: 'Relative',
    cumulative: 'Cumulative',
    hromada: 'Hromada',
    noIdps: 'Non-IDPs',
    register: 'Register',
    noIdpsOnly: 'Non-IDPs only',
    uaCitizen: 'UA citizen',
    appInMaintenance: 'Application in maintenance, we\'ll be back soon.',
    comments: 'Comments',
    ukrainianCitizenShip: 'Ukrainian citizenship',
    hhBarriersToPersonalDocument: 'Experienced barriers to obtain civil documents',
    atLeastOneMemberWorking: 'HHs with at least one member working',
    _meal: {
      openTracker: 'Open Excel tracker',
      visitMonitoring: 'Visit Monitoring',
      verification: 'Verification',
    },
    _protection: {
      filterEchoReporting: 'Filter duplication',
      filterEchoReportingDetails: (n: number) => `Skip ${n}% of HHS data to limit double counting.`,
      filterEchoReportingDisability: 'Filter with disability',
      filterEchoReportingDisabilityDetails: (n: number) => `Select ${n}% of individuals.`,
    },
    mealMonitoringVisit: {
      ecrec: 'ECREC activities',
      protection: 'Protection activities',
      eore: 'EORE activities',
      shelter: 'Shelter activities',
      lau: 'LAU activities',
      criticalConcern: 'Critical concern',
      nfiDistribution: 'NFI distributions',
      photoFolder: 'Photo folder',
      concerns: 'Concerns',
      securityConcerns: 'Security concerns',
      hasPriorityQueuesForVulnerableIndividuals: 'Priority queues for vulnerable individuals',
    },
    _mealVerif: {
      numericToleranceMargin: 'Tolerance margin',
      activityForm: 'Activity form',
      verificationForm: 'Verification form',
      showBoth: 'Show side by side',
      koboForm: `Kobo form`,
      newRequest: 'New request',
      requested: 'Request created!',
      verified: 'Verified',
      notVerified: 'Not verified',
      requestTitle: 'Meal Verification Request',
      selectedKoboForm: 'Selected Kobo form',
      duplicateErrors: (ids: string[]) => `Duplicate IDs found: ${ids.join(', ')}.`,
      selectedData: (n: number) => `You selected <b>${n}</b> rows`,
      sampleSizeN: (n: number) => `MEAL team will verify ${n}%`,
      sampleSize: 'Sample size',
      dataToBeVerified: (n?: number) => `<b>${n ?? '-'}</b> rows to be verified`,
      // sampleSize: 'Sample Size',
      applyFilters: 'Use table filters to selected data that must be verified.',
      selectedNRows: (n: number) => `Select ${n} rows`,
      giveANameToId: 'Give a name to identify this set of verifications',
      giveDetails: 'Give some details',
      allIndicators: 'Indicators',
      allValidIndicators: 'Valid indicators',
      allErrorIndicators: 'Invalid indicators',
      valid: 'Validity',
      viewRegistrationData: 'View Registration Data',
      viewDataCheck: 'View Verification Data',
    },
    _meta: {
      distinctBySubmission: 'By submission',
      distinctByTaxId: 'By tax ID',
      distinctByPhone: 'By phone number',
      refresh: 'Sync',
      killCache: 'Clear cache',
      refreshLong: 'Refresh started, can takes few minutes.',
      pluggedKobo: 'Plugged Kobo',
    },
    protHHS2: {
      freedomOfMovement: 'Barriers to Freedom of Movement',
      _hhComposition: {
        girl: '1 or + girls 0-17',
        boy: '1 or + boys 0-17',
        adultFemale: '1 or + adult females 18-60',
        adultMale: '1 or + adult males 18-60',
        olderFemale: '1 or + older females 60+',
        olderMale: '1 or + older males 60+',
      },
      hhComposition: 'HH Composition',
      factorToHelpIntegration: 'Factors Supporting Integration',
      factorToReturn: 'Factors influencing intentions to return',
      reasonForRelocate: 'Reasons for relocating',
      hhTypes: 'Household Status',
      reportedIncidents: 'Reported incidents over the last 6 months',
      hhsAffectedByMultipleDisplacement: 'Multiple displacements since February 24 2022 by current oblast',
      barriersToAccessHealth: 'Barriers to access healthcare',
      hhWithMemberHavingDifficulties: 'HHs reporting member(s) with disability',
      factors: 'Factors',
      unregisteredDisability: 'Unregistered disability',
      wg_using_your_usual_language_have_difficulty_communicating: 'Using your usual (customary) language',
      reducing_consumption_of_food: 'Reducing consumption of food',
      unemploymentFactors: 'Factors affecting employment ',
      timelineOfIncident: 'Timeline of Incident',
      protectionIncidents: 'Protection incidents',
      disabilityAndHealth: 'Disability & Health',
      descTitle: `Protection monitoring`,
      desc: `is defined as "systematically and regularly collecting, verifying and analysing information over an extended period of time
        in order to identify violations of rights and protection risks for populations of concern for the purpose of informing effective responses".
      `,
      disclaimer: `
        The dashboard was created by the Danish Refugee Council (DRC), and funded by USAID's Bureau for Humanitarian Assistance (BHA)
        and the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect 
        those of the European Union or the BHA. Neither the European Union nor the BHA can be held responsible for any use of the dashboard.
      `,
      mainConcernsRegardingHousing: 'Concerns related to current accommodation',
      typeOfIncident: 'Type of incident',
      poorRelationshipWithHostCommunity: 'Poor intercommunity relationships',
      poorSenseOfSafety: 'Poor sense of safety',
      reasonForLeaving: 'Factors influencing departure',
      safetyAndSecurity: 'Safety & Security',
      reasonForRemainInOrigin: 'Reason for remaining in the area of origin',
      familyMemberSeparated: 'HHs with separated member(s)',
      locationOfSeparatedFamilyMembers: 'Location of separated family member(s)',
      residentialIntentionsByHousehold: 'Residential Intentions by Household',
      mainSourceOfIncome: 'Main source of income',
      hhOutOfWorkAndSeekingEmployment: 'HHs with member(s) out of employment',
      ethnicMinorities: 'Ethnic minorities',
      accessBarriersToObtainDocumentation: 'Access barriers to obtain documentation',
      registrationAndDocumention: 'Registration & Documentation',
      missingDocumentationByOblastPopulation: 'Missing Documentation by Oblast Population',
      HHSwSN: 'Head of HH with specific needs',
      specificNeedsToHHS: 'Specific needs of HH',
      safetyOrSecurityConcernsDuringDisplacement: 'HHs reporting security concerns during displacement',
      HHs: 'HHs',
      AvgHHSize: 'AvgHHSize',
    },
    safety: {
      minusRusLabel: {
        prisoners: 'Prisoners',
        killed: 'Killed',
        aircraft: 'Aircraft',
        armored_combat_vehicles: 'Armored combat vehicles',
        artillery: 'Artillery',
        helicopters: 'Helicopters',
        wounded: 'Wounded',
        ships_boats: 'Ships boats',
        tanks: 'Tanks',
      },
      minusRusTitle: 'Intensity Proxy',
      dataTakenFromMinusRus: 'Data extracted in real-time from <a class="link" target="_blank" href="https://www.minusrus.com/en">https://www.minusrus.com/en</a>.',
      aggravatingFactors: 'Aggravating factors',
      lastAttacks: 'Last attacks',
      incidentTrackerTitle: 'Incidents dashboard',
      incidents: 'Incidents',
      incident: 'Incident',
      attackOfOn: (oblast?: OblastISO,
        type?: string[]) => `${type?.map(capitalize).join(' and ') ?? ''}${type ? ' a' : 'A'}ttack${oblast ? ` in ${OblastIndex.byIso(oblast).name}` : ''}`,
      attackTypes: 'Attack type',
      attacks: 'Attacks',
      attack: 'Attack',
      dead: 'Dead',
      injured: 'Injured',
      typeOfCasualties: 'Type of casualties',
      target: 'Target',
    },
    snapshotProtMonito: {
      basicNeeds: `Basic Needs`,
      livelihood: `Livelihoods & Coping mechanisms`,
      safetyProtectionIncidents: 'Safety & Major Stress Factors',
      MainProtectionNeeds: 'Main Protection Needs',
      displacementDesc: `Majority of the IDPs surveyed during the monitoring period reported having left their place of habitual residence between February and May 2022. Main factors influencing departure reported included shelling and attacks on civilians, destruction or damage of housing, land or property due to conflict, as well as occupation of property, exposure to UXOs/landmines and lack of access to livelihoods.`,
      integrateIntoTheLocalCommunity: 'Integrate into the local community',
      monitoredHhByOblast: 'Monitored HH By Oblast',
    },
    protHHSnapshot: {
      male1860: `Males 18-60 years old`,
      avgHhSize: (n: number) => `Average HH size: ${n.toFixed(1)}`,
      noAccommodationDocument: 'HHs without formal lease agreement',
      maleWithoutIDPCert: 'Unregistered IDPs',
      titles: {
        document: 'Registration & Documentation',
        livelihood: 'Livelihood',
        needs: 'Specific needs and priorities',
        safety: `Safety & Security`
      },
      title: 'Protection Monitoring Snapshot',
      title2: 'Ukraine',
    },
    sort: 'Sort',
    hardRefresh: 'Hard refresh',
    amount: 'Amount',
    target: 'Target',
    amountUAH: 'Amount UAH',
    amountUSD: 'Amount USD',
    date: 'Date',
    validFrom: 'Valid from',
    expiry: 'Expiry',
    departureFromAreaOfOrigin: `Displacement from area of origin`,
    displacementAndReturn: 'Displacement and Return Figures',
    returnToOrigin: `Return to area of origin`,
    dateOfDeparture: `Date of departure`,
    pin: 'Pin',
    warehouse: 'Warehouse',
    year: 'Year',
    vehicule: 'Vehicule',
    koboForm: 'Kobo form',
    koboForms: 'Kobo forms',
    disability: 'Disability',
    otherKoboForms: 'Other Kobo forms',
    _wfpDeduplication: {},
    _partner: {
      residualRisk: 'Residual Risk',
      vetting: 'Vetting',
      rapidMobilization: 'Rapid mobilization',
      relationship: 'Relationship',
      percentByTypeOfOrg: '% of Partner types',
      targetedMinorities: 'Targeted Minorities',
      benefReached: 'Total beneficiaries reached',
      benefPwdReached: 'Beneficiaries PwD reached',
      totalBudget: 'Total budget allocated',
      partners: 'Partners',
      sgas: 'SGAs',
      ongoingGrant: 'Ongoing grants',
      workingOblast: 'Working oblast',
      equitable: 'Equitable partnerships',
      partiallyEquitable: 'Partially equitable partnerships',
      womenLedOrganization: `Focused on women's right out of women-led org`,
      youthLedOrganization: `Focused on children out of youth-led org`,
      elderlyLedOrganization: `Focused on elders or PwD`,
    },
    mpca: {
      eskAllowance: 'ESK allowance',
      deleteTracker: 'Delete tracker?',
      deleteTrackerDetails: `It won't delete any data and you can recreate the tracker later.`,
      errorFormAlreadyExists: 'This tracked already exists.',
      addTracker: `Add tracker`,
      duplicationCheck: 'Duplication check',
      pullLastDataDesc: 'Get last Kobo submissions and rebuild the database.',
      committed: 'Committed',
      commit: 'Commit',
      projectOverride: 'Project override',
      projectFinal: 'Project Final',
      assistanceByLocation: 'Assistance by location',
      drcSupportSuggestion: {
        ThreeMonthsUnAgency: '3 Months Assistance - UN Agency',
        ThreeMonthsNoDuplication: '3 Months Assistance - No Duplication',
        TwoMonths: '2 Months Assistance',
        OneMonth: '1 Month Assistance',
        NoAssistanceFullDuplication: 'No Assistance - Full Duplication',
        NoAssistanceExactSameTimeframe: 'No Assistance - Exact Same Timeframe',
        NoAssistanceDrcDuplication: 'No Assistance - DRC Duplication',
        DeduplicationFailed: 'Deduplication Failed',
        ManualCheck: 'Manual Check',
      },
      uploadWfpTaxIdMapping: 'Upload Tax IDs',
      existingOrga: 'Existing orga',
      existingAmount: 'Existing amount',
      existingStart: 'Existing start',
      existingEnd: 'Existing end',
      signatory: 'Signatory',
      headOfOperations: 'Head of Operations',
      financeAndAdministrationOfficer: 'Finance and Administration officer',
      cashAndVoucherAssistanceAssistant: 'Cash and Voucher Assistance assistant',
      paymentTool: 'Payment tool',
      allAmountsAreWithoutTaxes: 'All amounts are in UAH without taxes',
      paymentTools: 'Payment tools',
      generateDeduplicationFile: 'Generate WFP file',
      makePaymentTool: 'Make Payment Tool',
      deduplicationCheck: 'Deduplication',
      budgetLineCFR: 'Budget Line CFR',
      budgetLineMPCA: 'Budget Line MPCA',
      budgetLineStartUp: 'Budget Line StartUp',
      mpcaGrantAmount: 'MPCA grant amount',
      cfrGrantAmount: 'CFR grant amount',
      startupGrantAmount: 'Start-up grant amount',
      status: {
        Deduplicated: 'Deduplicated',
        PartiallyDeduplicated: 'Partially deduplicated',
        NotDeduplicated: 'Not deduplicated',
        Error: 'Error',
      }
    },
    _koboDatabase: {
      translation: 'Translation',
      newValue: 'New value',
      koboQuestion: 'Kobo question',
      customColumn: 'Custom column',
      currentlyDisplayed: `columns displayed`,
      tagNotUpdated: 'Failed to update tag. Reloading clean data set...',
      downloadAsXLS: 'Download <b>filtered data</b> as XLS',
      registerNewForm: 'Register new form',
      repeatGroupsAsColumns: `Display repeat groups as new columns (also visible in XLS exports).`,
      title: (form?: string) => `Kobo Database${form ? `: <b>${form}</b>` : ``}`,
      showAllQuestions: 'Show unanswered questions',
      pullData: `Synchronize last Kobo data.`,
      pullDataAt: (lastUpdate: Date) => `Synchronize Kobo data.<br/>Last synchronization: <b>${formatDateTime(lastUpdate)}</b>.`,
      valueNoLongerInOption: 'This value is no longer in the options list',
      noAccessToForm: `You don't have access to any database.`,
      openKoboForm: 'Open Kobo form',
    },
    _cfm: {
      requestByOblast: 'Requests by Oblast',
      additionalInformation: 'Details',
      deleteWarning: `In case of mistake, you can still recover deleted data by contacting ${appConfig.contact}.`,
      _feedbackType: {
        'thanks': 'Thanks',
        'feedback': 'Feedback',
        'request': 'Request',
        'complaint': 'Complaint',
      },
      priority: 'Rank',
      openTicketsHigh: 'High priority',
      openTickets: 'Open tickets',
      referralMatrix: 'Referral Matrix',
      feedback: 'Feedback',
      feedbackType: 'Category',
      feedbackTypeExternal: 'Feedback type',
      contactAgreement: 'Contact agreement',
      existingDrcBeneficiary: 'Existing DRC beneficiary',
      reporterDetails: 'Reporter information',
      formLong: {
        Internal: 'Internal Form',
        External: 'External Form',
      },
      formFrom: {
        Internal: 'From Internal form',
        External: 'From External form',
      },
      form: {
        Internal: 'Internal',
        External: 'External',
      },
      status: {
        Close: 'Close',
        Open: 'Open',
        Processing: 'Processing',
      }
    },
    _admin: {
      createGroup: 'Create group',
    },
    _shelter: {
      assignedContractor: 'Assigned contractors',
      assessmentLocations: 'Assessments locations',
      repairCost: 'Total repairs cost',
      repairCostByHh: 'Repairs cost by HH',
      workDoneAt: 'Work done at',
      workDoneStart: 'Work done start',
      scoreLevel: 'Price level',
      priceLevel: 'Price level',
      roofSum: 'Σ Roof',
      windowsSum: 'Σ Window',
      agreement: 'Agreement',
      workOrder: 'Work order',
      contractor: 'Contractor',
      contractor1: 'Contractor lot 1',
      contractor2: 'Contractor lot 2',
      lot1: 'Lot 1',
      lot2: 'Lot 2',
      ntaForm: 'NTA form',
      taForm: 'TA form',
      taRefOk: 'Correct reference or not filled TA',
      taRefNok: 'Wrong NTA reference in TA',
      taFilled: 'TA form filled',
      taNotFilled: 'TA form NOT filled',
      validationStatus: 'Accepted?',
      progressStatus: 'Status',
      documentType: 'Doc type',
      owner: 'Tenant',
      ownershipDocumentExist: 'Ownership docs exist',
      ownershipDocument: 'Ownership docs',
      accommodation: 'Accommodation',
      total: 'Total',
      scoreDamage: 'Damage',
      scoreSocio: 'Socio',
      scoreDisplacement: 'Displ.',
      settlement: 'Settlement',
      street: 'Street',
      progress: {
        ContractorVisitDone: 'Contractor visit done',
        WorkEstimatesReceived: 'Work estimates received',
        PurchaseRequestDone: 'Purchase Request Done',
        WorkOrderDone: 'Work Order Done',
        RepairWorksStarted: 'Repair works Started',
        RepairWorksCompleted: 'Repair works completed',
        ContractorInvoiceReceived: 'Contractor invoice received',
        HandoverCertificateOfCompletionSigned: 'Handover/Certificate of completion signed',
        InvoicePaymentProcessed: 'Invoice payment processed',
      }
    },
    note: 'Note',
    projectCode: 'Project Code',
    form: 'Form',
    koboId: 'Kobo _id',
    desc: 'Desc',
    viewNMore: (n: number) => `View ${n} more`,
    viewNLess: (n: number) => `View ${n} less`,
    viewMore: 'More',
    viewLess: 'Less',
    timeConsumingOperation: 'Time consuming operation.',
    sector: 'Sector',
    showDummyAccounts: 'Show dummy accounts',
    filterBlanks: 'Filter blanks',
    total: 'Total',
    shouldDelete: 'Delete?',
    remove: 'Delete',
    sync: 'Sync',
    pullLast: 'Pull last',
    pullLastTitle: 'Pull last',
    beneficiaries: 'Beneficiaries',
  },
})
