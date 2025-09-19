import style from './SectionTitle.module.css'

export const SectionTitle = ({children}: {children: string}) => {
  return <h2 className={style.root}>{children}</h2>
}
