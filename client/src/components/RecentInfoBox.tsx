import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ChevronRight } from 'lucide-react'

interface RecentInfoBoxProps{
    title: string
    subtitle: string
    recentListLimit: number
    recentData: any[]
    ComponentToRender: React.ComponentType<any>
    cta: () => void
    type: string
}

function RecentInfoBox({title, subtitle, recentListLimit, recentData, ComponentToRender, cta}: RecentInfoBoxProps) {

  return (
    <Card className="col-span-1 min-h-80">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>
                {title}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={()=>cta()}>
                {subtitle}
            <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
        </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {recentData.length > 0 ? (
                    recentData.slice(0,recentListLimit).map((data, i)=> (
                        <ComponentToRender key={i} data={data}/>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground">No {title.toLowerCase()} available</div>
                )}
            </div>
            </CardContent>
    </Card>
  )
}

export default RecentInfoBox