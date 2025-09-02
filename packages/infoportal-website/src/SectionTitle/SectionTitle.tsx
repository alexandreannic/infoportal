import style from './SectionTitle.module.css'

export const SectionTitle = ({title}: {title: string}) => {
  return (
    <div className={style.root}>
      {title}
    </div>
  )
}