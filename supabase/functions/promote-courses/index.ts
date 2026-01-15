import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1'

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const today = new Date()
    const isAugust15 = today.getMonth() === 7 && today.getDate() === 15

    if (!isAugust15) {
      return new Response(
        JSON.stringify({ 
          message: 'Course promotion only runs on August 15',
          today: today.toISOString() 
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Get all active courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)

    if (coursesError) throw coursesError

    // Promote courses
    for (const course of courses || []) {
      if (course.level < 4) {
        // Promote to next level
        await supabase
          .from('courses')
          .update({ level: course.level + 1 })
          .eq('id', course.id)
      } else {
        // Archive course
        await supabase
          .from('courses')
          .update({ 
            archived: true, 
            is_active: false, 
            end_year: today.getFullYear() 
          })
          .eq('id', course.id)
      }
    }

    // Create new I kurs
    const { data: newCourse, error: newCourseError } = await supabase
      .from('courses')
      .insert({
        name: `I Kurs ${today.getFullYear()}`,
        level: 1,
        start_year: today.getFullYear(),
        team_count: 23,
        is_active: true,
      })
      .select()
      .single()

    if (newCourseError) throw newCourseError

    // Create teams for new course
    const teams = []
    for (let i = 1; i <= 23; i++) {
      teams.push({
        id: `${newCourse.id}-team-${i}`,
        name: `Taqım ${i}`,
        course_id: newCourse.id,
        commander: 'Təyin edilməyib',
        commander_contact: '',
      })
    }

    const { error: teamsError } = await supabase
      .from('teams')
      .insert(teams)

    if (teamsError) throw teamsError

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Courses promoted successfully',
        newCourse: newCourse.name
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
