import {Util} from './Utils'

describe('getObjectDiff', () => {
  it('should npreturn updated answers when values are changed', () => {
    const oldAnswers = {
      question1: 'Yes',
      question2: 'No',
      begin_repeat: [{repeatQuestion1: 'Answer 1'}, {repeatQuestion1: 'Answer 2'}],
    }

    const newAnswers = {
      question1: 'Yes',
      question2: 'Yes',
      begin_repeat: [{repeatQuestion1: 'Answer 1'}, {repeatQuestion1: 'Updated Answer'}],
      newQuestion: 'New Answer',
    }

    const updatedAnswers = Util.getObjectDiff({before: oldAnswers, after: newAnswers})
    expect(updatedAnswers).toEqual({
      question2: 'Yes',
      begin_repeat: [{repeatQuestion1: 'Answer 1'}, {repeatQuestion1: 'Updated Answer'}],
      newQuestion: 'New Answer',
    })
  })

  it('should return an empty object if there are no changes', () => {
    const oldAnswers = {
      question1: 'Yes',
      question2: 'No',
    }
    const newAnswers = {
      question1: 'Yes',
      question2: 'No',
    }
    const updatedAnswers = Util.getObjectDiff({before: oldAnswers, after: newAnswers})
    expect(updatedAnswers).toEqual({})
  })

  it('should return new keys that were not present in old answers', () => {
    const oldAnswers = {
      question1: 'Yes',
    }
    const newAnswers = {
      question1: 'Yes',
      question2: 'No',
    }
    const updatedAnswers = Util.getObjectDiff({before: oldAnswers, after: newAnswers})
    expect(updatedAnswers).toEqual({
      question2: 'No',
    })
  })

  it('should handle nested objects correctly', () => {
    const oldAnswers = {
      question1: {
        subQuestion1: 'Yes',
        subQuestion2: 1,
      },
    }
    const newAnswers = {
      question1: {
        subQuestion1: 'No',
        subQuestion2: 1,
      },
    }
    const updatedAnswers = Util.getObjectDiff({before: oldAnswers, after: newAnswers})
    expect(updatedAnswers).toEqual({
      question1: {subQuestion1: 'No', subQuestion2: 1},
    })
  })

  it('should return new keys even if others are skipped', () => {
    const oldAnswers: any = {
      question1: 'Yes',
    }
    const newAnswers: any = {
      question1: 'Yes',
      question2: 'No',
    }
    const updatedAnswers = Util.getObjectDiff({before: oldAnswers, after: newAnswers, skipProperties: ['question1']})
    expect(updatedAnswers).toEqual({
      question2: 'No',
    })
  })
})
