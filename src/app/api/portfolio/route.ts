import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch(`${process.env.REALTIME_DB_URL}/portfolio.json`)
    
    if (!res.ok) {
      throw new Error('Failed to fetch portfolio data')
    }
    
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching portfolio data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio data' },
      { status: 500 }
    )
  }
}